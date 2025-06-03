import { useState, useEffect } from "react";
import styles from '../styles/interview.module.css';
import { INTERVIEW_LABELS, GENDER } from "../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../data/interviewSelectOptions";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./interview-comps/ProfileSection";
import CompanySection from "./interview-comps/CompanySection";
import { postProfileInfo, postInterviewInfo, postPersona, postQuestions, getPersona } from "../api/interview";

const FORM_CACHE_KEY = "interviewFormData";

export default function Interview() {
  const navigate = useNavigate();

  // 캐시에서 초기값 불러오기
  const cachedData = JSON.parse(localStorage.getItem(FORM_CACHE_KEY) || "{}");

  const [gender, setGender] = useState(cachedData.gender || null);
  const [profileImage, setProfileImage] = useState(cachedData.profileImage || null);
  const [name, setName] = useState(cachedData.name || "");
  const [age, setAge] = useState(cachedData.age || "");
  const [organization, setOrganization] = useState(cachedData.organization || "");
  const [position, setPosition] = useState(cachedData.position || "");
  const [selectedCompany, setSelectedCompany] = useState(cachedData.selectedCompany || DEFAULT_COMPANIES[0]);
  const [selectedRole, setSelectedRole] = useState(cachedData.selectedRole || DEFAULT_ROLES[0]);
  const [resume, setResume] = useState(cachedData.resume || "");
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    resume: "",
  });

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const sessionCode = localStorage.getItem("sessionCode");
    if (!sessionCode) {
      alert("세션 코드가 없습니다. 로그인 상태를 확인해주세요.");
      return;
    }

    try {
      await postProfileInfo(sessionCode, {
        name,
        age,
        gender,
        education: {
          school: organization, // 상태에서 입력 받도록 수정
          major: position,  // 상태에서 입력 받도록 수정
          gradYear: 2024, // 상태에서 입력 받도록 수정
        },
        email: "keshicool9123@gmail.com", // 상태에서 입력 받도록 수정
      });

      await postInterviewInfo(sessionCode, {
        company: selectedCompany,
        position: selectedRole,
        self_intro: resume,
      });

      await postPersona(sessionCode)
      const personaRes = await getPersona(sessionCode);
      if (personaRes) {
        const enrichedPersona = {
          name: personaRes.persona_name,
          department: personaRes.department,
          profileImage: "/bot_avatar.png"
        };
        localStorage.setItem("persona", JSON.stringify(enrichedPersona));
      }

      await postQuestions(sessionCode, { num_questions: 5 });
      console.log(personaRes);

      navigate("/interview/chat", {
        state: {
          name,
          profileImage,
          selectedCompany,
          selectedRole,
          resume,
        },
      });
    } catch (err) {
      console.error("면접 시작 실패:", err);
      alert("면접 정보를 저장하는 데 실패했습니다.");
    }
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

  // 상태 변경될 때마다 캐시에 저장
  useEffect(() => {
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
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formData));
  }, [name, age, gender, organization, position, selectedCompany, selectedRole, resume, profileImage]);

  // 캐시 삭제 & 상태 초기화
  const handleReset = () => {
    // 확인창 표시
    const confirmed = window.confirm("입력한 내용을 모두 초기화하시겠습니까?");
    if (!confirmed) return;

    // 상태 초기화
    setName("");
    setAge("");
    setGender(null);
    setOrganization("");
    setPosition("");
    setSelectedCompany(DEFAULT_COMPANIES[0]);
    setSelectedRole(DEFAULT_ROLES[0]);
    setResume("");
    setProfileImage(null);

    // 에러 메시지 초기화
    setErrors({
      name: "",
      age: "",
      gender: "",
      resume: "",
    });

    // 캐시 삭제
    localStorage.removeItem(FORM_CACHE_KEY);
  };


  return (
    <div className={styles.interview_container}>
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

      <div className={styles.interviewStart_btn}>
        <button className={styles.resetButton} onClick={handleReset}>{INTERVIEW_LABELS.reset}</button>
        <button className={styles.submitButton} onClick={handleSubmit}>{INTERVIEW_LABELS.submit}</button>
      </div>
    </div>
  );
}