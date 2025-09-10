// src/components/interviewChat-comps/SpeechAnswerButtonFFmpeg.jsx
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/interviewChat.module.css";

export default function SpeechAnswerButtonFFmpeg({ wsRef, onUserText, canSend }) {
    const [isRec, setIsRec] = useState(false);
    const [sec, setSec] = useState(0);
    const [hint, setHint] = useState("");
    const [busy, setBusy] = useState(false);

    const timerRef = useRef(null);
    const mrRef = useRef(null);
    const chunksRef = useRef([]);
    const mimeRef = useRef("");
    const ffRef = useRef(null); // { api: 'modern'|'legacy', ff }

    // ---- helpers ----
    const toBlobURL = async (url, type) => {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`fetch ${url} ${r.status}`);
        const b = await r.blob();
        return URL.createObjectURL(new Blob([b], { type }));
    };

    const toUint8 = async (input) => {
        if (input instanceof Uint8Array) return input;
        if (input instanceof ArrayBuffer) return new Uint8Array(input);
        if (input instanceof Blob) return new Uint8Array(await input.arrayBuffer());
        if (typeof input === "string") {
            const r = await fetch(input);
            return new Uint8Array(await r.arrayBuffer());
        }
        throw new Error("Unsupported input to toUint8()");
    };

    // 어떤 모양으로 export 되든 잡아오는 동적 import
    const importFFmpegAny = async () => {
        const tries = [
            () => import("@ffmpeg/ffmpeg"),
            () => import("https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/+esm"),
            () => import("https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm/index.js"),
        ];
        let mod = null;
        for (const t of tries) { try { mod = await t(); break; } catch { } }
        if (!mod) throw new Error("Failed to import @ffmpeg/ffmpeg");
        const m = mod.default ?? mod;
        return {
            FFmpegClass: m.FFmpeg,        // 0.12+
            createFFmpeg: m.createFFmpeg,  // 0.11.x
        };
    };

    // 0.12+ 우선, 안 되면 0.11로 폴백
    const loadFF = async () => {
        if (!ffRef.current) {
            const { FFmpegClass, createFFmpeg } = await importFFmpegAny();
            const base = (import.meta.env.BASE_URL || "/") + "ffmpeg"; // public/ffmpeg/* 에 파일 3개

            if (typeof FFmpegClass === "function") {
                const ff = new FFmpegClass();
                setHint("FFmpeg 로딩…(최초 1회)");
                await ff.load({
                    workerURL: await toBlobURL(`${base}/worker.js`, "text/javascript"),
                    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
                    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
                });
                ffRef.current = { api: "modern", ff };
            } else if (typeof createFFmpeg === "function") {
                const ff = createFFmpeg({ log: false, corePath: `${base}/ffmpeg-core.js` });
                setHint("FFmpeg 로딩…(최초 1회)");
                await ff.load();
                ffRef.current = { api: "legacy", ff };
            } else {
                throw new Error("FFmpeg module shape not recognized");
            }
        }
        return ffRef.current;
    };

    const pickMime = () => {
        const cands = [
            "audio/webm;codecs=opus",
            "audio/ogg;codecs=opus",
            "audio/webm",
            "audio/ogg",
        ];
        for (const t of cands) if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
        return "";
    };

    const start = async () => {
        if (isRec || busy) return;
        console.log('canSend=', canSend, 'wsRef.current===', !!wsRef.current, 'state=', wsRef.current?.readyState);
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            setHint("WS 연결 중입니다. 잠시 후 다시 시도하세요.");
            return;
        }
        if (canSend === false) { // 부모에서 awaitingAnswer를 내려줄 경우
            setHint("질문 오디오가 끝나면 답변을 녹음할 수 있어요.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mime = pickMime();
            mimeRef.current = mime;

            const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
            chunksRef.current = [];
            mr.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data); };
            mr.onstop = async () => {
                clearInterval(timerRef.current); timerRef.current = null;
                setIsRec(false);
                setBusy(true);
                setHint("인코딩 준비…");

                try {
                    const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
                    chunksRef.current = [];

                    const { api, ff } = await loadFF();
                    const inputName = (mime && mime.includes("ogg")) ? "in.ogg" : "in.webm";
                    const bytes = await toUint8(blob);

                    if (api === "modern") {
                        await ff.writeFile(inputName, bytes);
                        setHint("MP3 변환 중…");
                        await ff.exec(["-i", inputName, "-vn", "-ac", "1", "-b:a", "96k", "out.mp3"]);
                        const out = await ff.readFile("out.mp3"); // Uint8Array
                        const mp3Blob = new Blob([out.buffer], { type: "audio/mpeg" });
                        await sendOverWS(mp3Blob);
                        try { await ff.deleteFile?.(inputName); await ff.deleteFile?.("out.mp3"); } catch { }
                    } else {
                        ff.FS("writeFile", inputName, bytes);
                        setHint("MP3 변환 중…");
                        await ff.run("-i", inputName, "-vn", "-ac", "1", "out.mp3", "-b:a", "96k");
                        const out = ff.FS("readFile", "out.mp3");
                        const mp3Blob = new Blob([out.buffer], { type: "audio/mpeg" });
                        await sendOverWS(mp3Blob);
                        try { ff.FS("unlink", inputName); ff.FS("unlink", "out.mp3"); } catch { }
                    }
                } catch (e) {
                    setHint(`인코딩 실패: ${e.message || e}`);
                } finally {
                    try { mrRef.current?.stream?.getTracks?.().forEach(t => t.stop()); } catch { }
                    mrRef.current = null;
                    setBusy(false);
                }
            };

            mrRef.current = mr;
            mr.start();
            setIsRec(true);
            setHint("녹음 중…");
            timerRef.current = setInterval(() => setSec(s => s + 1), 1000);
        } catch (e) {
            setHint(`마이크 오류: ${e.message}`);
        }
    };

    const sendOverWS = async (mp3Blob) => {
        setHint(`인코딩 완료 ${Math.round(mp3Blob.size / 1024)} KB`);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(await mp3Blob.arrayBuffer()); // 서버가 요구하는 "바이너리 1프레임"
            onUserText?.("(음성 응답 전송)");
        } else {
            setHint("WS 연결이 열려 있지 않습니다");
            console.log({ WebSocket })
        }
    };

    const stop = () => {
        try { if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop(); } catch { }
    };

    useEffect(() => () => stop(), []);

    return (
        <div className={styles.inputRow}>
            <button
                className={`${styles.micBtn} ${isRec ? styles.active : ""}`}
                onClick={isRec ? stop : start}
                disabled={busy || !canSend}
                aria-pressed={isRec}
                title={isRec ? "녹음 종료(전송)" : "녹음 시작"}
            >🎤</button>

            <div className={styles.sttPreview}>
                {isRec
                    ? <span className={styles.interimText}>
                        녹음 {String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}
                    </span>
                    : <span className={styles.sttTextMuted}>{busy ? "처리 중…" : "마이크 대기"}</span>}
                {hint && <span style={{ marginLeft: 8, color: "#666" }}>{hint}</span>}
            </div>
        </div>
    );
}
