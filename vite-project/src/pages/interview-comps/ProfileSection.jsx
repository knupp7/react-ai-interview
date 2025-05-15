import { INTERVIEW_LABELS, GENDER } from "../../constants/interviewFormStrings";
import ProfileImageUploader from "./ProfileImageUploader";
import styles from "../../styles/interview.module.css";

const ProfileSection = ({ 
  profileImage,
  setProfileImage,
  name, 
  setName, 
  age, 
  setAge, 
  gender, 
  setGender,
  organization,
  setOrganization,
  position,
  setPosition,
  errors
}) => {

  return (
    <>
      {/* ▶ 기본 정보 입력 필드: 이름, 나이, 성별, 조직, 직급 */}
      <h2 className={styles.section_title}>{INTERVIEW_LABELS.memberInfo}</h2>
      <div className={styles.profile_section}>
        <ProfileImageUploader profileImage={profileImage} setProfileImage={setProfileImage} />
        <div className={styles.form_grid}>
          {/* 이름 */}
          <label>{INTERVIEW_LABELS.name}</label>
          <div className={styles.input_with_error}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={INTERVIEW_LABELS.name} />
            {errors.name && <span className={styles.error_msg}>{errors.name}</span>}
          </div>

          {/* 나이 */}
          <label>{INTERVIEW_LABELS.age}</label>
          <div className={styles.input_with_error}>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={INTERVIEW_LABELS.age} />
            {errors.age && <span className={styles.error_msg}>{errors.age}</span>}
          </div>

          {/* 성별 */}
          <label>{INTERVIEW_LABELS.gender}</label>
          <div className={styles.input_with_error}>
            <div className={styles.gender_select}>
              <button
                type="button"
                className={`${styles.gender_btn} ${gender === "male" ? styles.active : ""}`}
                onClick={() => setGender("male")}
              >
                {GENDER.male}
              </button>
              <button
                type="button"
                className={`${styles.gender_btn} ${gender === "female" ? styles.active : ""}`}
                onClick={() => setGender("female")}
              >
                {GENDER.female}
              </button>
            </div>
            {errors.gender && <span className={styles.error_msg}>{errors.gender}</span>}
          </div>

          {/* 소속 */}
          <label>{INTERVIEW_LABELS.organization}</label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder={INTERVIEW_LABELS.organization} />

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