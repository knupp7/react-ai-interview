import React from 'react';
import APP_STRINGS from '../constants/appStrings';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  }

  return (
    <nav className="navbar">
      <div className="logo">{APP_STRINGS.NAV.LOGO}</div>
      <ul className="nav-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>{APP_STRINGS.NAV.HOME}</NavLink></li>
        <li><NavLink to="/interview" className={({ isActive }) => isActive ? 'active' : ''}>{APP_STRINGS.NAV.INTERVIEW}</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>{APP_STRINGS.NAV.CONTACT}</NavLink></li>
      </ul>
      <div className="auth-buttons">
        <button className="signup" onClick={handleSignUpClick}>{APP_STRINGS.NAV.SIGNUP}</button>
        <button className="login" onClick={handleLoginClick}>{APP_STRINGS.NAV.LOGIN}</button>
      </div>
    </nav>
  );
}