import React, { useState } from 'react';
import '../styles/SignUp.css';
import signupStrings from '../constants/signupStrings';
import validateSignupForm from '../utils/validateSignupForm';

export default function SignUp() {
    const [form, setForm] = useState({
        userid: '',
        userpwd: '',
        userpwdCheck: '',
        name: '',
        age: '',
        organization: '',
        job: '',
    });

    const [gender, setGender] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateSignupForm(form, gender);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('폼 제출 성공!', form);
            // API 호출 등 실제 가입 처리
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

                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* 아이디 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.userid}</label>
                        <input
                            type="text"
                            name="userid"
                            value={form.userid}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.userid}
                        />
                        <span className="error-placeholder">{errors.userid}</span>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.userpwd}</label>
                        <input
                            type="password"
                            name="userpwd"
                            value={form.userpwd}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.userpwd}
                        />
                        <span className="error-placeholder">{errors.userpwd}</span>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.userpwdCheck}</label>
                        <input
                            type="password"
                            name="userpwdCheck"
                            value={form.userpwdConfirm}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.userpwdCheck}
                        />
                        <span className="error-placeholder">{errors.userpwdCheck}</span>
                    </div>

                    {/* 이름 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.name}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.name}
                        />
                        <span className="error-placeholder">{errors.name}</span>
                    </div>

                    {/* 나이 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.age}</label>
                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.age}
                        />
                        <span className="error-placeholder">{errors.age}</span>
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
                        <span className="error-placeholder">{errors.gender}</span>
                    </div>

                    {/* 소속 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.organization}</label>
                        <input
                            type="text"
                            name="organization"
                            value={form.organization}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.organization}
                        />
                        <span className="error-placeholder">{errors.organization}</span>
                    </div>

                    {/* 직급 */}
                    <div className="form-row">
                        <label>{signupStrings.fields.job}</label>
                        <input
                            type="text"
                            name="job"
                            value={form.job}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.job}
                        />
                        <span className="error-placeholder">{errors.job}</span>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="submit-row">
                        <button type="submit" className="submit-btn">
                            {signupStrings.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}