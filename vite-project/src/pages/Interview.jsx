import { useState, useEffect, useRef } from "react";
import styles from '../styles/interview.module.css';
import { INTERVIEW_LABELS, GENDER } from "../constants/interviewFormStrings";
import { DEFAULT_COMPANIES, DEFAULT_ROLES } from "../data/interviewSelectOptions";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./interview-comps/ProfileSection";
import CompanySection from "./interview-comps/CompanySection";
import { postProfileInfo, postInterviewInfo, postPersona, postQuestions, getPersona } from "../api/interview";
// import LoadingSpinner from "../components/LoadingSpinner";
import LoadingOverlay from "../components/LoadingOverlay";

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
  const [resumeMode, setResumeMode] = useState(cachedData.resumeMode || "upload"); // 'upload' | 'text'
  const [resumeFileSelected, setResumeFileSelected] = useState(
    typeof cachedData.resumeFileSelected === "boolean" ? cachedData.resumeFileSelected : false
  );

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    resume: "",
  });
  const [loading, setLoading] = useState(false);

  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [loadingErr, setLoadingErr] = useState("");

  const steps = [
    "프로필 저장 중",
    "지원 정보 저장 중",
    "면접관 구성 중",
    "면접관 정보 불러오는 중",
    "질문 생성 중"
  ];

  // 재시도를 위해 마지막 payload들을 기억
  const lastPayload = useRef(null);

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const isFinished = localStorage.getItem("interviewFinished") === "true";
    if (isFinished) {
      navigate("/interview/result");
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    lastPayload.current = { // 필요시 저장
      name, age, gender, organization, position, selectedCompany, selectedRole, resume
    };
    try {
      await runFlow();
    } catch (err) {
      console.error(err);
      setLoadingErr(err?.message || "알 수 없는 오류가 발생했습니다.");
    }
  };

  const handleRetry = async () => {
    try {
      await runFlow();
    } catch (err) {
      console.error(err);
      setLoadingErr(err?.message || "다시 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setLoadingOpen(false);
    setLoadingErr("");
    setLoadingStep(0);
    setLoadingMsg("");
    // 필요하면 홈으로
    // navigate("/");
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

    if (resumeMode === 'text') {
      if (!resume || resume.length < 20) {
        newErrors.resume = "자기소개서는 20자 이상 입력해주세요.";
      }
    } else {
      const hasEnoughText = resume && resume.length >= 20;
      if (!resumeFileSelected && !hasEnoughText) {
        newErrors.resume = "PDF 업로드 또는 20자 이상 입력이 필요합니다.";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
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
      resumeMode,
      resumeFileSelected,
      profileImage,
    };
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formData));
  }, [name, age, gender, organization, position, selectedCompany, selectedRole, resume, resumeMode, resumeFileSelected, profileImage]);

  // 캐시 삭제 & 상태 초기화
  const handleReset = () => {
    // 확인창 표시
    const confirmed = window.confirm("입력한 내용을 모두 초기화하시겠습니까?");
    if (!confirmed) return;

    // 상태 초기화
    // setName("");
    // setAge("");
    // setGender(null);
    // setOrganization("");
    // setPosition("");
    setSelectedCompany(DEFAULT_COMPANIES[0]);
    setSelectedRole(DEFAULT_ROLES[0]);
    setResume("");
    // setProfileImage(null);

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

  const runFlow = async () => {
    const sessionCode = localStorage.getItem("sessionCode");
    if (!sessionCode) throw new Error("세션 코드가 없습니다. 로그인 상태를 확인해주세요.");

    setLoadingOpen(true);
    setLoadingErr("");
    setLoadingStep(0);
    setLoadingMsg("입력하신 프로필을 저장하고 있어요.");

    // 1. 프로필
    await postProfileInfo(sessionCode, {
      name, age, gender,
      education: { school: organization, major: position, gradYear: 2024 },
      email: "keshicool9123@gmail.com",
    });

    setLoadingStep(1);
    setLoadingMsg(`${selectedCompany} ${selectedRole} 지원 정보를 저장하고 있어요.`);

    // 2. 인터뷰 정보
    await postInterviewInfo(sessionCode, {
      company: selectedCompany, position: selectedRole, self_intro: resume,
    });

    setLoadingStep(2);
    setLoadingMsg("면접관 캐릭터를 구성 중입니다.");

    // 3. 페르소나 생성
    await postPersona(sessionCode);

    setLoadingStep(3);
    setLoadingMsg("면접관 정보를 불러오고 있어요.");

    // 4. 페르소나 조회 → localStorage 저장
    const personaRes = await getPersona(sessionCode);
    if (personaRes) {
      const enrichedPersona = {
        name: personaRes.persona_name,
        department: personaRes.department,
        profileImage: "/bot_avatar.png",
      };
      localStorage.setItem("persona", JSON.stringify(enrichedPersona));
    }

    setLoadingStep(4);
    setLoadingMsg("기술 면접 질문을 생성하고 있어요. 잠시만 기다려 주세요.");

    // 5. 질문 생성
    await postQuestions(sessionCode, { num_questions: 5 });

    // 완료
    setLoadingOpen(false);
    navigate("/interview/chat", {
      state: { name, profileImage, selectedCompany, selectedRole, resume },
    });
  };

  return (
    <div className={styles.interview_container}>
      <div className={styles.pageCard}>
        <ProfileSection
          name={name} setName={setName}
          profileImage={profileImage} setProfileImage={setProfileImage}
          age={age} setAge={setAge}
          gender={gender} setGender={setGender}
          organization={organization} setOrganization={setOrganization}
          position={position} setPosition={setPosition}
          errors={errors} />

        <hr className={styles.hr} />

        <CompanySection
          selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany}
          selectedRole={selectedRole} setSelectedRole={setSelectedRole}
          resume={resume} setResume={setResume}
          resumeMode={resumeMode} setResumeMode={setResumeMode}
          resumeFileSelected={resumeFileSelected} setResumeFileSelected={setResumeFileSelected}
          errors={errors} />


        {!loadingOpen ? (
          <div className={styles.interviewStart_btn}>
            <button className={styles.resetButton} onClick={handleReset}>{INTERVIEW_LABELS.reset}</button>
            <button className={styles.submitButton} onClick={handleSubmit}>{INTERVIEW_LABELS.submit}</button>
          </div>
        ) : (
          <LoadingOverlay
            isOpen={loadingOpen}
            steps={steps}
            currentStep={loadingStep}
            message={loadingMsg}
            error={loadingErr}
            onRetry={loadingErr ? handleRetry : undefined}
            onCancel={handleCancel}
            title="맞춤 기술면접 세팅 중..."
          />
        )}



      </div>
    </div>
  );
}