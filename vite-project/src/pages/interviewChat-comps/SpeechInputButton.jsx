// src/components/interviewChat-comps/SpeechInputButton.jsx
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/interviewChat.module.css";

const chooseMimeType = () => {
    const cands = [
        "audio/webm;codecs=opus", // Chrome/Edge
        "audio/ogg;codecs=opus",  // Firefox
        "audio/webm",
        "audio/ogg",
    ];
    for (const t of cands) {
        if (MediaRecorder.isTypeSupported?.(t)) return t;
    }
    return ""; // 브라우저가 결정
};

const SpeechInputButton = ({
    onSend,
    uploadUrl,
    autoStart = false,
    maxSeconds = 120,
    fieldName = "file",
}) => {
    const sessionCode = localStorage.getItem("sessionCode");
    const endpoint =
        uploadUrl ||
        `http://localhost:8000/sessions/${sessionCode}/stt`;

    const recRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const [supported, setSupported] = useState(true);
    const [isRec, setIsRec] = useState(false);
    const [sec, setSec] = useState(0);
    const [mime, setMime] = useState("");
    const [hint, setHint] = useState("");

    // 초기화
    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
            setSupported(false);
            return;
        }
        setMime(chooseMimeType());
    }, []);

    // 자동 시작 옵션
    useEffect(() => {
        if (autoStart) startRec();
        return () => stopRec(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoStart]);

    const startRec = async () => {
        if (!supported || isRec) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
            chunksRef.current = [];

            mr.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
            };
            mr.onerror = (e) => setHint(`녹음 오류: ${e.error?.message || e.name}`);
            mr.onstop = async () => {
                // Blob → 업로드
                const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
                await uploadBlob(blob);
            };

            mr.start(); // timeslice 없이 전체를 한 파일로
            recRef.current = mr;
            setIsRec(true);
            setSec(0);
            setHint("");

            // 타이머
            timerRef.current = setInterval(() => {
                setSec((s) => {
                    const next = s + 1;
                    if (next >= maxSeconds) stopRec(); // 자동 종료
                    return next;
                });
            }, 1000);
        } catch (e) {
            setHint(`마이크 권한/장치 오류: ${e.message}`);
        }
    };

    const stopRec = (skipUpload = false) => {
        try {
            if (recRef.current && recRef.current.state !== "inactive") {
                // stop() 호출하면 onstop에서 업로드가 실행됨
                if (skipUpload) {
                    // 업로드 생략 모드(언마운트/취소 등)
                    recRef.current.onstop = null;
                }
                recRef.current.stop();
            }
        } catch { }
        recRef.current = null;

        // 스트림 정리
        try {
            streamRef.current?.getTracks?.().forEach((t) => t.stop());
        } catch { }
        streamRef.current = null;

        setIsRec(false);
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const uploadBlob = async (blob) => {
        if (!blob || !blob.size) {
            setHint("빈 오디오입니다. 다시 시도하세요.");
            return;
        }
        setHint("업로드 중…");
        try {
            // multipart/form-data
            const form = new FormData();
            const ext = (mime.includes("ogg") && "ogg") || "webm";
            form.append(fieldName, blob, `answer.${ext}`);

            const res = await fetch(endpoint, {
                method: "POST",
                body: form,
            });
            if (!res.ok) {
                throw new Error(`서버 오류: ${res.status}`);
            }
            // 서버 응답: { text: "..." } 또는 { transcript: "..." } 둘 다 대응
            const json = await res.json();
            const text = (json.text || json.transcript || "").trim();

            if (text) {
                onSend(text); // ✅ 기존 WS 흐름에 태워보냄
                setHint("");
            } else {
                setHint("인식 결과가 비어 있습니다.");
            }
        } catch (e) {
            setHint(`업로드 실패: ${e.message}`);
        } finally {
            chunksRef.current = [];
            setSec(0);
        }
    };

    const cancel = () => {
        // 업로드 없이 녹음만 폐기
        stopRec(true);
        chunksRef.current = [];
        setHint("취소됨");
        setTimeout(() => setHint(""), 1200);
    };

    if (!supported) {
        return (
            <div className={styles.inputRow}>
                <div className={styles.unsupported}>
                    이 브라우저는 MediaRecorder를 지원하지 않습니다. (Chrome/Edge 권장)
                </div>
            </div>
        );
    }

    return (
        <div className={styles.inputRow}>
            <button
                className={`${styles.micBtn} ${isRec ? styles.active : ""}`}
                onClick={isRec ? () => stopRec() : startRec}
                aria-pressed={isRec}
                title={isRec ? "녹음 종료 및 업로드" : "녹음 시작"}
            >
                🎤
            </button>

            <div className={styles.sttPreview}>
                {isRec ? (
                    <span className={styles.interimText}>
                        녹음 중… {String(Math.floor(sec / 60)).padStart(2, "0")}:
                        {String(sec % 60).padStart(2, "0")}
                    </span>
                ) : (
                    <span className={styles.sttTextMuted}>
                        마이크 대기. 버튼을 눌러 답변을 녹음하세요.
                    </span>
                )}
                {hint && <span style={{ marginLeft: 8, color: "#666" }}>{hint}</span>}
            </div>

            {isRec && (
                <button className={styles.cancelBtn} onClick={cancel} title="업로드 없이 취소">
                    취소
                </button>
            )}
        </div>
    );
};

export default SpeechInputButton;
