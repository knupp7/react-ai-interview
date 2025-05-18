import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import LOGIN_STRINGS from '../constants/loginStrings';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const validateForm = (userId, userPwd) => {
    if (!userId.trim()) {
      return '아이디를 입력해주세요.';
    }
    if (!userPwd) {
      return '비밀번호를 입력해주세요.';
    }

    return null; // 유효성 통과
  };

  const handleLogin = () => {
    const errorMsg = validateForm(userId, userPwd);
    if (errorMsg) {
        alert(errorMsg);
        return;
    }

    // 나중에 서버로 POST 요청
    console.log('Login attempt:', { userId, userPwd });
  };

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
          <button className={styles.signupButton}>{LOGIN_STRINGS.SIGNUP_BUTTON}</button>
        </div>
      </div>
    </div>
  );
};