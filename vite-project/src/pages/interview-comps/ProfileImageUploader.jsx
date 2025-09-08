import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/ProfileImageUploader.module.css";

const MAX_SIZE_MB = 5;

export default function ProfileImageUploader({
  profileImage,
  setProfileImage,
  /** 'rounded' | 'circle' */
  shape = "rounded",
  /** px 단위 사이즈 (가로=세로) */
  size = 120,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  // CSS 변수로 사이즈 전달
  const wrapperStyle = useMemo(() => ({ ["--size"]: `${size}px` }), [size]);

  useEffect(() => {
    return () => {
      // objectURL 정리 (profileImage가 objectURL일 경우)
      if (profileImage?.startsWith?.("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const validateFile = (file) => {
    if (!file) return "이미지를 선택해주세요.";
    if (!file.type.startsWith("image/")) return "이미지 파일만 업로드할 수 있어요.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `파일 용량은 ${MAX_SIZE_MB}MB 이하여야 해요.`;
    return null;
  };

  const setImageFromFile = (file) => {
    const msg = validateFile(file);
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageFromFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFromFile(file);
  };

  const clearImage = () => {
    if (profileImage?.startsWith?.("blob:")) URL.revokeObjectURL(profileImage);
    setProfileImage(null);
    setError("");
  };

  return (
    <div
      className={`${styles.profile_image_wrapper} ${isDragging ? styles.dragging : ""}`}
      style={wrapperStyle}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`${styles.profile_image} ${shape === "circle" ? styles.circle : ""}`}
        aria-label="프로필 이미지 업로드 영역"
        role="img"
      >
        {profileImage ? (
          <img src={profileImage} alt="프로필 미리보기" className={styles.image_preview} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon} aria-hidden>👤</span>
            <span className={styles.placeholderText}>이미지 업로드</span>
          </div>
        )}

        {/* 상단 오른쪽: 삭제 버튼 (이미지 있을 때만) */}
        {profileImage && (
          <button
            type="button"
            className={styles.remove_button}
            onClick={clearImage}
            aria-label="이미지 삭제"
            title="이미지 삭제"
          >
            ×
          </button>
        )}

        {/* 하단 오른쪽: 업로드 버튼 */}
        <label className={styles.upload_button} title="이미지 선택">
          <img src="/ic_camera.svg" alt="" className={styles.camera_icon} aria-hidden />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            capture="environment"
            className={styles.hidden_input}
          />
        </label>

        {/* 포커스 이동용 outline */}
        <span className={styles.focus_ring} aria-hidden />
      </div>

      {/* 힌트/에러 영역 */}
      <div className={styles.hint_row}>
        {!error ? (
          <span className={styles.hint}>JPG/PNG/GIF, 최대 {MAX_SIZE_MB}MB • 드래그&드롭 가능</span>
        ) : (
          <span className={styles.error}>{error}</span>
        )}
      </div>
    </div>
  );
}