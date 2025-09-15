import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import LOGIN_STRINGS from '../constants/loginStrings';
import { useNavigate } from 'react-router-dom';
import { joinSession } from '../api/session';


export default function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const validateForm = (userId, userPwd) => {
    if (!userId.trim()) {
      return '아이디를 입력해주세요.';
    }
    if (!userPwd) {
      return '비밀번호를 입력해주세요.';
    }

    return null; // 유효성 통과
  };

  const handleLogin = async () => {
    const errorMsg = validateForm(userId, userPwd);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const code = localStorage.getItem('sessionCode');
      if (!code) {
        alert("저장된 세션 코드가 없습니다. 회원가입 후 이용해주세요.");
        return;
      }

      const { sessionId, createdAt } = await joinSession(code, userId, userPwd);

      localStorage.setItem('sessionToken', sessionId);
      localStorage.setItem('sessionCreatedAt', createdAt);

      navigate('/interview');
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  const handleSignupClick = () => {
    navigate("/signup")
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            {!imgError && (
              <img
                src="/duri_new_p.png"
                alt="duri character"
                className={styles.characterImg}
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>계정에 로그인하세요</p>
        </div>

        {/* Form */}
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="login-userid" className={styles.label}>
              아이디
            </label>
            <input
              id="login-userid"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={styles.input}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="login-password" className={styles.label}>
              비밀번호
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={userPwd}
                onChange={(e) => setUserPwd(e.target.value)}
                className={styles.passwordInput}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={styles.passwordToggle}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>

        {/* Signup section */}
        <div className={styles.signupSection}>
          <span className={styles.signupText}>계정이 없으신가요?</span>
          <button
            type="button"
            onClick={handleSignupClick}
            className={styles.signupButton}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};