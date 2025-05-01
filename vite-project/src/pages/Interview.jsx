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

  const handleSubmit = () => {
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
    navigate("/interview-chat", { state: formData });
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
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder={INTERVIEW_LABELS.name} />

          <label>{INTERVIEW_LABELS.age}</label>
          <input 
            type="text" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={INTERVIEW_LABELS.age} />

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
        {INTERVIEW_LABELS.inputInfo}<span className="required">*</span>
      </h2>

      <hr></hr>

      <div className="form-group">
        <label>
          {INTERVIEW_LABELS.company}<span className="required">*</span>
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
          {INTERVIEW_LABELS.role}<span className="required">*</span>
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
          {INTERVIEW_LABELS.resume}<span className="required">*</span>
        </label>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)} 
          placeholder={INTERVIEW_LABELS.resumePlaceholder}></textarea>
      </div>

      <div className="submit-btn">
        <button onClick={handleSubmit}>{INTERVIEW_LABELS.submit}</button>
      </div>
    </div>
  );
}