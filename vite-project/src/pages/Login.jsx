import React from 'react';
import '../styles/Login.css';
import LOGIN_STRINGS from '../constants/loginStrings';

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="title-row">
            <img src="/duri.png" alt="duri character" className="login-char-img" />
            <h2 className="login-title">{LOGIN_STRINGS.TITLE}</h2>
        </div>

        <div className="input-group">
          <label>{LOGIN_STRINGS.ID_LABEL}</label>
          <input type="text" />
        </div>

        <div className="input-group">
          <label>{LOGIN_STRINGS.PASSWORD_LABEL}</label>
          <input type="password" />
        </div>

        <button className="login-button">{LOGIN_STRINGS.LOGIN_BUTTON}</button>

        <hr className="divider" />

        <div className="signup-section">
          <span>{LOGIN_STRINGS.SIGNUP_QUESTION}</span>
          <button className="signup-button">{LOGIN_STRINGS.SIGNUP_BUTTON}</button>
        </div>
      </div>
    </div>
  );
};