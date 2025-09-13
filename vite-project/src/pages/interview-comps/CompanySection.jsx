import { useEffect, useRef } from "react";
import { INTERVIEW_LABELS } from "../../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../../data/interviewSelectOptions";
import ResumeUploader from './ResumeUploader';
import styles from "../../styles/interview.module.css";

const CompanySection = ({
  selectedCompany, setSelectedCompany,
  selectedRole, setSelectedRole,
  resume, setResume,
  resumeMode, setResumeMode,
  resumeFileSelected, setResumeFileSelected,
  errors
}) => {
  const textareaRef = useRef(null);

  // mount & resume 변경 시 높이 업데이트
  useEffect(() => {
    handleResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  // 자소서 입력하는 만큼 높이 늘리기
  const handleResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const scrollY = window.scrollY;
    textarea.style.height = "auto";
    textarea.style.height = Math.max(textarea.scrollHeight + 4, 220) + "px";
    window.scrollTo({ top: scrollY });
  };

  const onSwitchToUpload = () => {
    setResumeMode('upload');
    // 업로드 모드로 전환 시, 이전에 업로드했던 기록을 유지하고 싶다면 이 줄은 생략
    // setResumeFileSelected(false);
  };

  const onSwitchToText = () => {
    setResumeMode('text');
    // 직접 입력 모드에서는 업로드 충족 조건을 비활성화
    setResumeFileSelected(false);
  };

  return (
    <>
      {/* 2. 지원 항목 선택 영역 (기업, 직군, 자소서) */}
      <h2 className={styles.section_title}>
        {INTERVIEW_LABELS.inputInfo}
        <span className={styles.label_required}>*</span>
      </h2>

      {/* ▶ 기업 선택 */}
      <div className={styles.form_row}>
        <label htmlFor="select-company" className={styles.label}>
          {INTERVIEW_LABELS.company}
          <span className={styles.label_required}>*</span>
        </label>
        <select
          id="select-company"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {DEFAULT_COMPANIES.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* ▶ 직군 선택 */}
      <div className={styles.form_row}>
        <label htmlFor="select-role" className={styles.label}>
          {INTERVIEW_LABELS.role}
          <span className={styles.label_required}>*</span>
        </label>
        <select
          id="select-role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {DEFAULT_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* ▶ 업로드 모드 */}
      {resumeMode === 'upload' ? (
        <div className={styles.form_row}>
          <label className={styles.label}>{INTERVIEW_LABELS.resume}</label>
          <div className={styles.input_with_error}>
            <ResumeUploader
              setResume={(txt) => setResume(txt)}
              onExtracted={() => setResumeFileSelected(true)}
            />
            {errors.resume && <span className={styles.error_msg}>{errors.resume}</span>}
          </div>
        </div>
      ) : (
        // ▶ 직접 입력 모드
        <div className={styles.form_row}>
          <label htmlFor="textarea-resume" className={styles.label}>
            {INTERVIEW_LABELS.resume}
            <span className={styles.label_required}>*</span>
          </label>
          <div className={styles.input_with_error}>
            <textarea
              id="textarea-resume"
              className={styles.resume_textarea}
              ref={textareaRef}
              spellCheck={false}
              value={resume}
              onChange={(e) => {
                setResume(e.target.value);
                handleResize();
              }}
              placeholder={INTERVIEW_LABELS.resumePlaceholder}
            />
            {errors.resume && (
              <span className={styles.error_msg}>{errors.resume}</span>
            )}
          </div>
        </div>
      )}
      {/* ▶ 업로드/입력 선택 */}
      <div className={styles.form_row}>
        <span className={styles.label}>{INTERVIEW_LABELS.resumeMode}</span>
        <div className={styles.segmented} role="tablist" aria-label="자기소개서 입력 방식">
          <button
            type="button"
            className={`${styles.segmentedBtn} ${resumeMode === 'upload' ? styles.selected : ''}`}
            onClick={onSwitchToUpload}
            aria-pressed={resumeMode === 'upload'}
            role="tab"
          >
            PDF 업로드
          </button>
          <button
            type="button"
            className={`${styles.segmentedBtn} ${resumeMode === 'text' ? styles.selected : ''}`}
            onClick={onSwitchToText}
            aria-pressed={resumeMode === 'text'}
            role="tab"
          >
            직접 입력
          </button>
        </div>
      </div>
    </>
  );
};

export default CompanySection;