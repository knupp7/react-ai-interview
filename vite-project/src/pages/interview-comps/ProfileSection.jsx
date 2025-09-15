import { INTERVIEW_LABELS, GENDER } from "../../constants/interviewFormStrings";
import ProfileImageUploader from "./ProfileImageUploader";
import styles from "../../styles/interview.module.css";

const ProfileSection = ({
  profileImage, setProfileImage,
  name, setName,
  age, setAge,
  gender, setGender,
  organization, setOrganization,
  position, setPosition,
  errors
}) => {

  return (
    <>
      {/* ▶ 기본 정보 입력 필드: 이름, 나이, 성별, 조직, 직급 */}
      <h2 className={styles.section_title}>{INTERVIEW_LABELS.memberInfo}</h2>

      <div className={styles.profile_section}>
        <ProfileImageUploader
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />
        <div className={styles.form_grid}>
          {/* 이름 */}
          <label htmlFor="pf-name">{INTERVIEW_LABELS.name}</label>
          <div className={styles.input_with_error}>
            <input
              id="pf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={INTERVIEW_LABELS.name}
              className={`${styles.input} ${errors.name ? styles.input_error : ""}`}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            {errors.name && <span className={styles.error_msg}>{errors.name}</span>}
          </div>

          {/* 나이 */}
          <label htmlFor="pf-age">{INTERVIEW_LABELS.age}</label>
          <div className={styles.input_with_error}>
            <input
              id="pf-age"
              type="number"
              min={1}
              max={100}
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={INTERVIEW_LABELS.age}
              className={`${styles.input} ${errors.age ? styles.input_error : ""}`}
              aria-invalid={!!errors.age}
            />
            {errors.age && <span className={styles.error_msg}>{errors.age}</span>}
          </div>

          {/* 성별 */}
          <label>{INTERVIEW_LABELS.gender}</label>
          <div className={styles.input_with_error}>
            <div className={styles.gender_select} role="tablist" aria-label="성별 선택">
              <button
                type="button"
                className={`${styles.gender_btn} ${gender === "male" ? styles.active : ""}`}
                onClick={() => setGender("male")}
                aria-pressed={gender === "male"}
                role="tab"
              >
                {GENDER.male}
              </button>
              <button
                type="button"
                className={`${styles.gender_btn} ${gender === "female" ? styles.active : ""}`}
                onClick={() => setGender("female")}
                aria-pressed={gender === "female"}
                role="tab"
              >
                {GENDER.female}
              </button>
            </div>
            {errors.gender && <span className={styles.error_msg}>{errors.gender}</span>}
          </div>

          {/* 소속 */}
          <label htmlFor="pf-org">{INTERVIEW_LABELS.organization}</label>
          <input
            id="pf-org"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder={(INTERVIEW_LABELS.organization)+(" (학교, 회사 등)")}
            className={styles.input}
            autoComplete="organization"
          />

          {/* 직급 */}
          <label>{INTERVIEW_LABELS.position}</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder={INTERVIEW_LABELS.position} />
        </div>
      </div>
    </>
  );
}

export default ProfileSection;