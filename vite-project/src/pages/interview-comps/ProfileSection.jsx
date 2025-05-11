import { INTERVIEW_LABELS, GENDER } from "../../constants/interviewFormStrings";

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
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <>
      <h2 className="section-title">{INTERVIEW_LABELS.memberInfo}</h2>  {/* 회원정보 */}
      <div className="profile-section">
        <div className="profile-image-wrapper">
          {/* profile image */}
          <div className="profile-image">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="image-preview" />
            ) : (
              <span role="img" aria-label="default">🙍‍♂️</span>
            )}
          </div>
          <label className="upload-button">
            <img src="/ic_camera.svg" alt="카메라" className="camera-icon" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

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