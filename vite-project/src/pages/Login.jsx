import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import LOGIN_STRINGS from '../constants/loginStrings';
import { useNavigate } from 'react-router-dom';
import { joinSession } from '../api/session';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
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
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.titleRow}>
          <img src="/duri.png" alt="duri character" className={styles.loginCharImg} />
          <h2 className={styles.loginTitle}>{LOGIN_STRINGS.TITLE}</h2>
        </div>

        <div className={styles.inputGroup}>
          <label>{LOGIN_STRINGS.ID_LABEL}</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)} />
        </div>

        <div className={styles.inputGroup}>
          <label>{LOGIN_STRINGS.PASSWORD_LABEL}</label>
          <input
            type="password"
            value={userPwd}
            onChange={(e) => setUserPwd(e.target.value)} />
        </div>

        <button className={styles.loginButton} onClick={handleLogin}>
          {LOGIN_STRINGS.LOGIN_BUTTON}
        </button>

        <hr className={styles.divider} />

        <div className={styles.signupSection}>
          <span>{LOGIN_STRINGS.SIGNUP_QUESTION}</span>
          <button className={styles.signupButton} onClick={handleSignupClick}>{LOGIN_STRINGS.SIGNUP_BUTTON}</button>
        </div>
      </div>
    </div>
  );
};