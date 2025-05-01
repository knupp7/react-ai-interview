import React, { useState } from "react";
import '../styles/interview.css';
import { INTERVIEW_LABELS, GENDER } from "../constants/interviewFormStrings";

export default function Interview() {
  const [gender, setGender] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="interview-container">
      <h2 className="section-title">{INTERVIEW_LABELS.memberInfo}</h2>
      <div className="profile-section">
      <div className="profile-image-wrapper">
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
        <div className="form-grid">
          <label>{INTERVIEW_LABELS.name}</label>
          <input type="text" placeholder={INTERVIEW_LABELS.name} />

          <label>{INTERVIEW_LABELS.age}</label>
          <input type="text" placeholder={INTERVIEW_LABELS.age} />

          <label>{INTERVIEW_LABELS.gender}</label>
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

          <label>{INTERVIEW_LABELS.organization}</label>
          <input type="text" placeholder={INTERVIEW_LABELS.organization} />

          <label>{INTERVIEW_LABELS.position}</label>
          <input type="text" placeholder={INTERVIEW_LABELS.position} />
        </div>
      </div>



      <h2 className="section-title">
        {INTERVIEW_LABELS.inputInfo}<span className="required">*</span>
      </h2>

      <hr></hr>

      <div className="form-group">
        <label>
          {INTERVIEW_LABELS.company}<span className="required">*</span>
        </label>
        <select>
          <option>네이버</option>
          <option>카카오</option>
          <option>라인</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          {INTERVIEW_LABELS.role}<span className="required">*</span>
        </label>
        <select>
          <option>모바일 개발자</option>
          <option>프론트엔드 개발자</option>
          <option>백엔드 개발자</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          {INTERVIEW_LABELS.resume}<span className="required">*</span>
        </label>
        <textarea placeholder={INTERVIEW_LABELS.resumePlaceholder}></textarea>
      </div>

      <div className="submit-btn">
        <button>{INTERVIEW_LABELS.submit}</button>
      </div>
    </div>
  );
}