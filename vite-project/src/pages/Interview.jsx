import { useState } from "react";
import '../styles/interview.css';
import { INTERVIEW_LABELS, GENDER } from "../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../data/interviewSelectOptions";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./interview-comps/ProfileSection";
import CompanySection from "./interview-comps/CompanySection";

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

  return (
    <div className="interview-container">
      <ProfileSection
        name={name} setName={setName}
        profileImage={profileImage} setProfileImage={setProfileImage}
        age={age} setAge={setAge}
        gender={gender} setGender={setGender}
        organization={organization} setOrganization={setOrganization}
        position={position} setPosition={setPosition}
        errors={errors} />

      <hr />

      <CompanySection 
        selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} 
        selectedRole={selectedRole} setSelectedRole={setSelectedRole}
        resume={resume} setResume={setResume}
        errors={errors} />

      <div className="submit-btn">
        <button onClick={handleSubmit}>{INTERVIEW_LABELS.submit}</button>
      </div>
    </div>
  );
}