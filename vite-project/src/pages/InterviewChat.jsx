import { useLocation, useNavigate } from "react-router-dom";

export default function InterviewStart() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  if (!formData) {
    return <p>입력 정보가 없습니다.</p>;
  }

  const {
    name,
    age,
    gender,
    organization,
    position,
    selectedCompany,
    selectedRole,
    resume,
    profileImage
  } = formData;

  const handleStartInterviewResult = () => {
    navigate("/interview/result", { state: formData }); 
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        인터뷰 정보 확인
      </h1>

      {/* 프로필 이미지 */}
      <div style={{ marginBottom: "20px" }}>
        <h2>프로필 이미지</h2>
        {profileImage ? (
          <img
            src={profileImage}
            alt="업로드된 프로필"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      {/* 기본 정보 */}
      <div style={{ marginBottom: "20px" }}>
        <h2>기본 정보</h2>
        <p><strong>이름:</strong> {name}</p>
        <p><strong>나이:</strong> {age}</p>
        <p><strong>성별:</strong> {gender === "male" ? "남자" : "여자"}</p>
        <p><strong>소속:</strong> {organization}</p>
        <p><strong>직급/직업:</strong> {position}</p>
      </div>

      {/* 선택 항목 */}
      <div style={{ marginBottom: "20px" }}>
        <h2>선택 항목</h2>
        <p><strong>지원 기업:</strong> {selectedCompany}</p>
        <p><strong>지원 직군:</strong> {selectedRole}</p>
      </div>

      {/* 자소서 */}
      <div>
        <h2>자기소개서</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            backgroundColor: "#f9f9f9",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ddd"
          }}
        >
          {resume}
        </pre>
      </div>

      {/* 인터뷰 결과 페이지 이동 버튼 */}
      <button
        onClick={handleStartInterviewResult}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        인터뷰 결과 확인하기
      </button>
    </div>
  );
}
