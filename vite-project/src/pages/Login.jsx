import React from 'react';
import '../styles/Login.css';

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/duri.png" alt="duri character" className="character" />
        <h2>DURI-INTERN</h2>

        <div className="input-group">
          <label>아이디</label>
          <input type="text" />
        </div>

        <div className="input-group">
          <label>비밀번호</label>
          <input type="password" />
        </div>

        <button className="login-button">로그인</button>

        <hr className="divider" />

        <div className="signup-section">
          <span>처음이신가요?</span>
          <button className="signup-button">회원가입</button>
        </div>
      </div>
    </div>
  );
};