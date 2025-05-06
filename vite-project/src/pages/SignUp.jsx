import React, { useState } from 'react';
import '../styles/SignUp.css';
import signupStrings from '../constants/signupStrings';

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
                <h2 className="signup-title">{signupStrings.title}</h2>
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
                        <label>{signupStrings.fields.userid}</label>
                        <input type="text" placeholder={signupStrings.fields.userid} />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.userpwd}</label>
                        <input type="password" placeholder={signupStrings.fields.userpwd} />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 이름 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.name}</label>
                        <input type="text" placeholder={signupStrings.fields.name} />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 나이 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.age}</label>
                        <input type="number" placeholder={signupStrings.fields.age} />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 성별 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.gender}</label>
                        <div className="gender-buttons">
                            <button
                                type="button"
                                className={gender === 'male' ? 'selected' : ''}
                                onClick={() => setGender('male')}
                            >
                                {signupStrings.genderOptions.male}
                            </button>
                            <button
                                type="button"
                                className={gender === 'female' ? 'selected' : ''}
                                onClick={() => setGender('female')}
                            >
                                {signupStrings.genderOptions.female}
                            </button>
                        </div>
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 소속기관 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.organization}</label>
                        <input type="text" placeholder={signupStrings.fields.organization} />
                        <span className="error-placeholder"></span>
                    </div>

                    {/* 직급/직업 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.job}</label>
                        <input type="text" placeholder={signupStrings.fields.job} />
                        <span className="error-placeholder"></span>
                    </div>

                    <div className="submit-row">
                        <button type="submit" className="submit-btn">{signupStrings.submit}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}