import { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function ResumeUploader({ setResume, onExtracted, maxSizeMB = 10 }) {
    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const pickFile = () => inputRef.current?.click();

    const extractText = async (f) => {
        setBusy(true);
        setError('');
        try {
            const buf = await f.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            let full = '';

            for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
                const page = await pdf.getPage(pageNo);
                const content = await page.getTextContent({
                    normalizeWhitespace: true,
                    disableCombineTextItems: false,
                });
                const text = content.items
                    .map((i) => (i && i.str ? i.str : ''))
                    .join(' ');
                full += (pageNo > 1 ? '\n\n' : '') + text;
            }

            const trimmed = full.trim();

            // 세분화: 빈 텍스트 (스캔본 가능성 높음)
            if (!trimmed) {
                setError('PDF에 텍스트가 없는 것 같아요(스캔본일 수 있어요). 텍스트가 포함된 PDF를 올리거나 OCR이 필요합니다.');
                return;
            }

            // 성공 처리
            if (typeof setResume === 'function') {
                setResume(trimmed);
                try {
                    const cache = JSON.parse(localStorage.getItem('interviewFormData') || '{}');
                    cache.resume = trimmed;
                    localStorage.setItem('interviewFormData', JSON.stringify(cache));
                } catch { }
            }
            onExtracted?.();
        } catch (e) {
            console.error(e);
            setError('PDF에서 텍스트를 추출하지 못했습니다. (파일 손상/암호화/형식 문제일 수 있어요)');
        } finally {
            setBusy(false);
        }
    };

    const handleChange = (e) => {
        const f = e.target.files?.[0] || null;
        setError('');
        if (!f) return;

        // 세분화: PDF 타입 아님
        if (f.type !== 'application/pdf') {
            setError(`PDF 파일만 업로드할 수 있어요. (${f.type || 'unknown'})`);
            return;
        }
        // 세분화: 용량 초과
        if (f.size > maxSizeMB * 1024 * 1024) {
            const mb = (f.size / (1024 * 1024)).toFixed(1);
            setError(`파일 용량(${mb}MB)이 제한(${maxSizeMB}MB)를 초과했어요.`);
            return;
        }

        setFile(f);
        extractText(f); // 선택 즉시 추출
    };

    return (
        <div style={{ display: 'grid', gap: 8 }}>
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleChange}
                style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" onClick={pickFile} disabled={busy}>
                    PDF 선택
                </button>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                    {file ? `${file.name} (${Math.round(file.size / 1024)} KB)` : '선택된 파일 없음'}
                </span>
            </div>

            {busy && <div style={{ fontSize: 12 }}>텍스트 추출 중…</div>}
            {error && <div style={{ color: '#ef4444', fontSize: 12 }}>{error}</div>}
        </div>
    );
}
