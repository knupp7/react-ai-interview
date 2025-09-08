import React, { useState } from 'react';
import styles from '../styles/SignUp.module.css';
import signupStrings from '../constants/signupStrings';
import validateSignupForm from '../utils/validateSignupForm';
import ProfileImageUploader from '../pages/interview-comps/ProfileImageUploader';
import { createSession, joinSession } from '../api/session';
import { useNavigate } from 'react-router-dom';

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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors = validateSignupForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);

      const { code } = await createSession(form.userid, form.userpwd);
      const { sessionId, createdAt } = await joinSession(code, form.userid, form.userpwd);

      // 세션 저장
      localStorage.setItem('sessionToken', sessionId);
      localStorage.setItem('sessionCode', code);
      if (createdAt) localStorage.setItem('sessionCreatedAt', createdAt);

      // 페이지 이동
      navigate('/interview');
    } catch (err) {
      console.error('회원가입 중 오류:', err);
      alert('회원가입 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formBox}>
        <header className={styles.header}>
          <h2 className={styles.signupTitle}>{signupStrings.title}</h2>
        </header>

        <div className={styles.profileSection}>
          <ProfileImageUploader
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        </div>

        <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
          {/* 아이디 */}
          <div className={styles.formRow}>
            <label htmlFor="userid" className={styles.label}>
              {signupStrings.fields.userid}
            </label>
            <input
              id="userid"
              type="text"
              name="userid"
              value={form.userid}
              onChange={handleChange}
              className={`${styles.input} ${errors.userid ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.userid}
              autoComplete="username"
              aria-invalid={!!errors.userid}
            />
            <span className={styles.errorText}>{errors.userid}</span>
          </div>

          {/* 비밀번호 */}
          <div className={styles.formRow}>
            <label htmlFor="userpwd" className={styles.label}>
              {signupStrings.fields.userpwd}
            </label>
            <input
              id="userpwd"
              type="password"
              name="userpwd"
              value={form.userpwd}
              onChange={handleChange}
              className={`${styles.input} ${errors.userpwd ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.userpwd}
              autoComplete="new-password"
              aria-invalid={!!errors.userpwd}
            />
            <span className={styles.errorText}>{errors.userpwd}</span>
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.formRow}>
            <label htmlFor="userpwdCheck" className={styles.label}>
              {signupStrings.fields.userpwdCheck}
            </label>
            <input
              id="userpwdCheck"
              type="password"
              name="userpwdCheck"
              value={form.userpwdCheck}
              onChange={handleChange}
              className={`${styles.input} ${errors.userpwdCheck ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.userpwdCheck}
              autoComplete="new-password"
              aria-invalid={!!errors.userpwdCheck}
            />
            <span className={styles.errorText}>{errors.userpwdCheck}</span>
          </div>

          {/* 이름 */}
          <div className={styles.formRow}>
            <label htmlFor="name" className={styles.label}>
              {signupStrings.fields.name}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.name}
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
            <span className={styles.errorText}>{errors.name}</span>
          </div>

          {/* 나이 */}
          <div className={styles.formRow}>
            <label htmlFor="age" className={styles.label}>
              {signupStrings.fields.age}
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className={`${styles.input} ${errors.age ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.age}
              inputMode="numeric"
              min={0}
              aria-invalid={!!errors.age}
            />
            <span className={styles.errorText}>{errors.age}</span>
          </div>

          {/* 성별 */}
          <div className={styles.formRow}>
            <span className={styles.label}>{signupStrings.fields.gender}</span>
            <div className={styles.segmented}>
              <button
                type="button"
                className={`${styles.segmentedBtn} ${form.gender === 'male' ? styles.selected : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, gender: 'male' }))}
                aria-pressed={form.gender === 'male'}
              >
                {signupStrings.genderOptions.male}
              </button>
              <button
                type="button"
                className={`${styles.segmentedBtn} ${form.gender === 'female' ? styles.selected : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, gender: 'female' }))}
                aria-pressed={form.gender === 'female'}
              >
                {signupStrings.genderOptions.female}
              </button>
            </div>
            <span className={styles.errorText}>{errors.gender}</span>
          </div>

          {/* 소속 */}
          <div className={styles.formRow}>
            <label htmlFor="organization" className={styles.label}>
              {signupStrings.fields.organization}
            </label>
            <input
              id="organization"
              type="text"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              className={`${styles.input} ${errors.organization ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.organization}
              autoComplete="organization"
              aria-invalid={!!errors.organization}
            />
            <span className={styles.errorText}>{errors.organization}</span>
          </div>

          {/* 직급 */}
          <div className={styles.formRow}>
            <label htmlFor="job" className={styles.label}>
              {signupStrings.fields.job}
            </label>
            <input
              id="job"
              type="text"
              name="job"
              value={form.job}
              onChange={handleChange}
              className={`${styles.input} ${errors.job ? styles.inputError : ''}`}
              placeholder={signupStrings.fields.job}
              autoComplete="organization-title"
              aria-invalid={!!errors.job}
            />
            <span className={styles.errorText}>{errors.job}</span>
          </div>

          {/* 제출 버튼 */}
          <div className={styles.submitRow}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? signupStrings.submitting ?? '처리 중…' : signupStrings.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}