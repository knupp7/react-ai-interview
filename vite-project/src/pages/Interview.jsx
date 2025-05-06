import React, { useState } from "react";
import '../styles/interview.css';
import { INTERVIEW_LABELS, GENDER } from "../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../data/interviewSelectOptions";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const [gender, setGender] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [organization, setOrganization] = useState("");
  const [position, setPosition] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(DEFAULT_COMPANIES[0]);
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLES[0]);
  const [resume, setResume] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    resume: "",
  });  

  const handleSubmit = () => {
    if (!validateForm()) return; // 유효성 검사 통과하지 않으면 리턴
  
    const formData = {
      name,
      age,
      gender,
      organization,
      position,
      selectedCompany,
      selectedRole,
      resume,
      profileImage,
    };
    navigate("/interview/chat", { state: formData });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      age: "",
      gender: "",
      resume: "",
    };
  
    if (!name) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (name.length > 7) {
      newErrors.name = "이름은 7자 이내여야 합니다.";
    } else if (!/^[가-힣a-zA-Z]+$/.test(name)) {
      newErrors.name = "이름에는 한글 또는 영문자만 입력 가능합니다.";
    }
  
    if (!age) {
      newErrors.age = "나이를 입력해주세요.";
    } else if (!/^\d+$/.test(age)) {
      newErrors.age = "나이는 숫자만 입력해주세요.";
    } else if (Number(age) < 1 || Number(age) > 100) {
      newErrors.age = "나이는 1살 이상 100살 이하로 입력해주세요.";
    }
  
    if (!gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }
  
    if (!resume || resume.length < 20) {
      newErrors.resume = "자기소개서는 20자 이상 입력해주세요.";
    }
  
    setErrors(newErrors);
  
    // 에러가 하나라도 있으면 false 반환
    return !Object.values(newErrors).some((msg) => msg);
  };
  
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



      <h2 className="section-title">
        {INTERVIEW_LABELS.inputInfo}<span className="label-required">*</span>
      </h2>

      <hr></hr>

      <div className="form-group">
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

      <div className="form-group">
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

      <div className="form-group">
        <label>
          {INTERVIEW_LABELS.resume}<span className="label-label-required">*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)} 
            placeholder={INTERVIEW_LABELS.resumePlaceholder}/>
          {errors.resume && <span className="error-msg resume-error">{errors.resume}</span>}
        </div>
      </div>

      <div className="submit-btn">
        <button onClick={handleSubmit}>{INTERVIEW_LABELS.submit}</button>
      </div>
    </div>
  );
}