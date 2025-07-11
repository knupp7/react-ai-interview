import { useEffect, useRef } from "react";
import { INTERVIEW_LABELS } from "../../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../../data/interviewSelectOptions";
import styles from "../../styles/interview.module.css";

const CompanySection = ({
  selectedCompany,
  setSelectedCompany,
  selectedRole,
  setSelectedRole,
  resume,
  setResume,
  errors
}) => {

  const textareaRef = useRef(null);

  useEffect(() => {
    handleResize();
  }, []);

  // 자소서 입력하는 만큼 창 늘려주기
  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const scrollY = window.scrollY;

      textarea.style.height = "auto";
      textarea.style.height = Math.max(textarea.scrollHeight + 3, 160) + "px"; // 내용 높이만큼 증가, 3px는 기본 margin

      window.scrollTo({ top: scrollY });
    }
  };

  return (
    <>
      {/* 2. 지원 항목 선택 영역 (기업, 직군, 자소서) */}
      <h2 className={styles.section_title}>
        {INTERVIEW_LABELS.inputInfo}
        <span className={styles.label_required}>*</span>
      </h2>

      <div className={styles.form_group}>  {/* ▶ 기업 선택 */}
        <label>
          {INTERVIEW_LABELS.company}
          <span className={styles.label_required}>*</span>
        </label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {DEFAULT_COMPANIES.map((company, idx) => (
            <option key={idx}>{company}</option>
          ))}
        </select>
      </div>

      <div className={styles.form_group}> {/* ▶ 직군 선택 */}
        <label>
          {INTERVIEW_LABELS.role}
          <span className={styles.label_required}>*</span>
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {DEFAULT_ROLES.map((role, idx) => (
            <option key={idx}>{role}</option>
          ))}
        </select>
      </div>

      <div className={styles.form_group}>  {/* ▶ 자기소개서 입력 */}
        <label>
          {INTERVIEW_LABELS.resume}
          <span className={styles.label_required}>*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <textarea
            ref={textareaRef}
            spellCheck={false}
            value={resume}
            onChange={(e) => {
              setResume(e.target.value)
              handleResize();
            }}
            placeholder={INTERVIEW_LABELS.resumePlaceholder} />
          {errors.resume && (
            <span className={`${styles.error_msg} ${styles.resume_error}`}>
              {errors.resume}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default CompanySection;