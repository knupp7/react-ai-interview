import React, { useState } from "react";
import '../styles/interview.css';

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
      <h2 className="section-title">회원정보</h2>
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
          <label>이름</label>
          <input type="text" placeholder="이름" />

          <label>나이</label>
          <input type="text" placeholder="나이" />

          <label>성별</label>
          <div className="gender-select">
            <button
              type="button"
              className={gender === "male" ? "gender-btn active" : "gender-btn"}
              onClick={() => setGender("male")}
            >
              남자
            </button>
            <button
              type="button"
              className={gender === "female" ? "gender-btn active" : "gender-btn"}
              onClick={() => setGender("female")}
            >
              여자
            </button>
          </div>

          <label>회사/학교/소속기관</label>
          <input type="text" placeholder="회사/학교/소속기관" />

          <label>직급/직업</label>
          <input type="text" placeholder="직급/직업" />
        </div>
      </div>



      <h2 className="section-title">
        입력사항<span className="required">*</span>
      </h2>

      <hr></hr>

      <div className="form-group">
        <label>
          기업 선택<span className="required">*</span>
        </label>
        <select>
          <option>네이버</option>
          <option>카카오</option>
          <option>라인</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          직군 선택<span className="required">*</span>
        </label>
        <select>
          <option>모바일 개발자</option>
          <option>프론트엔드 개발자</option>
          <option>백엔드 개발자</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          자소서 입력<span className="required">*</span>
        </label>
        <textarea placeholder="자기소개서를 입력해주세요."></textarea>
      </div>

      <div className="submit-btn">
        <button>인터뷰 시작</button>
      </div>
    </div>
  );
}