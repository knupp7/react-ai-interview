import { INTERVIEW_LABELS, GENDER } from "../../constants/interviewFormStrings";
import ProfileImageUploader from "./ProfileImageUploader";

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
      <h2 className="section-title">{INTERVIEW_LABELS.memberInfo}</h2>  {/* 회원정보 */}
      <div className="profile-section">
        <ProfileImageUploader profileImage={profileImage} setProfileImage={setProfileImage} />
        <div className="form-grid">   {/* 회원정보 입력 폼 */}
          <label>{INTERVIEW_LABELS.name}</label>
          <div className="input-with-error">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={INTERVIEW_LABELS.name} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <label>{INTERVIEW_LABELS.age}</label>
          <div className="input-with-error">
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={INTERVIEW_LABELS.age} />
            {errors.age && <span className="error-msg">{errors.age}</span>}
          </div>

          <label>{INTERVIEW_LABELS.gender}</label>
          <div className="input-with-error">
            <div className="gender-select">
              <button
                type="button"
                className={gender === "male" ? "gender-btn active" : "gender-btn"}
                onClick={() => setGender("male")}
              >
                {GENDER.male}
              </button>
              <button
                type="button"
                className={gender === "female" ? "gender-btn active" : "gender-btn"}
                onClick={() => setGender("female")}
              >
                {GENDER.female}
              </button>
            </div>
            {errors.gender && <span className="error-msg">{errors.gender}</span>}
          </div>

          <label>{INTERVIEW_LABELS.organization}</label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder={INTERVIEW_LABELS.organization} />

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