import React, { useState } from 'react';
import '../styles/Login.css';
import LOGIN_STRINGS from '../constants/loginStrings';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const handleLogin = () => {
    // 나중에 서버로 POST 요청
    console.log('Login attempt:', { userId, userPwd });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="title-row">
            <img src="/duri.png" alt="duri character" className="login-char-img" />
            <h2 className="login-title">{LOGIN_STRINGS.TITLE}</h2>
        </div>

        {/* 아이디 */}
        <div className="input-group">
          <label>{LOGIN_STRINGS.ID_LABEL}</label>
          <input 
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)} />
        </div>

        {/* 비밀번호 */}
        <div className="input-group">
          <label>{LOGIN_STRINGS.PASSWORD_LABEL}</label>
          <input 
            type="password"
            value={userPwd}
            onChange={(e) => setUserPwd(e.target.value)} />
        </div>

        <button className="login-button" onClick={handleLogin}>
            {LOGIN_STRINGS.LOGIN_BUTTON}
        </button>

        <hr className="divider" />

        <div className="signup-section">
          <span>{LOGIN_STRINGS.SIGNUP_QUESTION}</span>
          <button className="signup-button">{LOGIN_STRINGS.SIGNUP_BUTTON}</button>
        </div>
      </div>
    </div>
  );
};