import React, { useState } from 'react';
import styles from '../styles/SignUp.module.css';
import signupStrings from '../constants/signupStrings';
import validateSignupForm from '../utils/validateSignupForm';
import ProfileImageUploader from '../pages/interview-comps/ProfileImageUploader';

export default function SignUp() {
    const [form, setForm] = useState({
        userid: '',
        userpwd: '',
        userpwdCheck: '',
        name: '',
        age: '',
        gender: '',
        organization: '',
        job: '',
    });

    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateSignupForm(form);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('폼 제출 성공!', form);
            // 실제 가입 처리(API 호출 등)
        }
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.formBox}>
                <h2 className={styles.signupTitle}>{signupStrings.title}</h2>

                <ProfileImageUploader
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                />

                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    {/* 아이디 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.userid}</label>
                        <input
                            type="text"
                            name="userid"
                            value={form.userid}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.userid}
                        />
                        <span className={styles.errorPlaceholder}>{errors.userid}</span>
                    </div>

                    {/* 비밀번호 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.userpwd}</label>
                        <input
                            type="password"
                            name="userpwd"
                            value={form.userpwd}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.userpwd}
                        />
                        <span className={styles.errorPlaceholder}>{errors.userpwd}</span>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.userpwdCheck}</label>
                        <input
                            type="password"
                            name="userpwdCheck"
                            value={form.userpwdCheck}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.userpwdCheck}
                        />
                        <span className={styles.errorPlaceholder}>{errors.userpwdCheck}</span>
                    </div>

                    {/* 이름 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.name}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.name}
                        />
                        <span className={styles.errorPlaceholder}>{errors.name}</span>
                    </div>

                    {/* 나이 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.age}</label>
                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.age}
                        />
                        <span className={styles.errorPlaceholder}>{errors.age}</span>
                    </div>

                    {/* 성별 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.gender}</label>
                        <div className={styles.genderButtons}>
                            <button
                                type="button"
                                className={`${styles.button} ${form.gender === 'male' ? styles.selected : ''}`}
                                onClick={() => setForm((prev) => ({ ...prev, gender: 'male' }))}
                            >
                                {signupStrings.genderOptions.male}
                            </button>
                            <button
                                type="button"
                                className={`${styles.button} ${form.gender === 'female' ? styles.selected : ''}`}
                                onClick={() => setForm((prev) => ({ ...prev, gender: 'female' }))}
                            >
                                {signupStrings.genderOptions.female}
                            </button>
                        </div>
                        <span className={styles.errorPlaceholder}>{errors.gender}</span>
                    </div>

                    {/* 소속 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.organization}</label>
                        <input
                            type="text"
                            name="organization"
                            value={form.organization}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.organization}
                        />
                        <span className={styles.errorPlaceholder}>{errors.organization}</span>
                    </div>

                    {/* 직급 */}
                    <div className={styles.formRow}>
                        <label>{signupStrings.fields.job}</label>
                        <input
                            type="text"
                            name="job"
                            value={form.job}
                            onChange={handleChange}
                            placeholder={signupStrings.fields.job}
                        />
                        <span className={styles.errorPlaceholder}>{errors.job}</span>
                    </div>

                    {/* 제출 버튼 */}
                    <div className={styles.submitRow}>
                        <button type="submit" className={styles.submitBtn}>
                            {signupStrings.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}