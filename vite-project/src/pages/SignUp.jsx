import React, { useState } from 'react';
import '../styles/SignUp.css';

export default function SignUp() {
    const [gender, setGender] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    return (
        <div className="signup-container">
            <div className="form-box">
                <h2 className="signup-title">회원가입</h2>
                <div className="profile-section">
                    {/* ▶ 프로필 이미지 */}
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
                </div>

                {/* ▶ 기본 정보 입력 필드: 이름, 나이, 성별, 조직, 직급 */}
                <form className="signup-form">
                    {/* 아이디 */}
                    <div className="form-row">
                        <label>아이디</label>
                        <input type="text" placeholder="아이디" />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-row">
                        <label>비밀번호</label>
                        <input type="password" placeholder="비밀번호" />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 이름 */}
                    <div className="form-row">
                        <label>이름</label>
                        <input type="text" placeholder="이름" />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 나이 */}
                    <div className="form-row">
                        <label>나이</label>
                        <input type="number" placeholder="나이" />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 성별 */}
                    <div className="form-row">
                        <label>성별</label>
                        <div className="gender-buttons">
                            <button
                                type="button"
                                className={gender === 'male' ? 'selected' : ''}
                                onClick={() => setGender('male')}
                            >
                                남자
                            </button>
                            <button
                                type="button"
                                className={gender === 'female' ? 'selected' : ''}
                                onClick={() => setGender('female')}
                            >
                                여자
                            </button>
                        </div>
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 소속기관 */}
                    <div className="form-row">
                        <label>회사/학교/소속기관</label>
                        <input type="text" placeholder="회사/학교/소속기관" />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 직급/직업 */}
                    <div className="form-row">
                        <label>직급/직업</label>
                        <input type="text" placeholder="직급/직업" />
                        <span className="error-placeholder"></span>
                    </div>

                    <div className="submit-row">
                        <button type="submit" className="submit-btn">가입하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}