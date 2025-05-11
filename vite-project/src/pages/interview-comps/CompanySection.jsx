import { INTERVIEW_LABELS } from "../../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../../data/interviewSelectOptions";

const CompanySection = ({
  selectedCompany,
  setSelectedCompany,
  selectedRole,
  setSelectedRole,
  resume,
  setResume,
  errors
}) => {

  return (
    <>
      {/* 2. 지원 항목 선택 영역 (기업, 직군, 자소서) */}
      <h2 className="section-title">
        {INTERVIEW_LABELS.inputInfo}<span className="label-required">*</span>
      </h2>

      <div className="form-group">  {/* ▶ 기업 선택 */}
        <label>
          {INTERVIEW_LABELS.company}<span className="label-required">*</span>
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

      <div className="form-group"> {/* ▶ 직군 선택 */}
        <label>
          {INTERVIEW_LABELS.role}<span className="label-required">*</span>
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {DEFAULT_ROLES.map((company, idx) => (
            <option key={idx}>{company}</option>
          ))}
        </select>
      </div>

      <div className="form-group">  {/* ▶ 자기소개서 입력 */}
        <label>
          {INTERVIEW_LABELS.resume}<span className="label-required">*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder={INTERVIEW_LABELS.resumePlaceholder} />
          {errors.resume && <span className="error-msg resume-error">{errors.resume}</span>}
        </div>
      </div>
    </>
  );
}

export default CompanySection;