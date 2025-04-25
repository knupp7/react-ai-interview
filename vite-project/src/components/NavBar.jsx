import React from 'react';
import APP_STRINGS from '../constants/appStrings';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">{APP_STRINGS.NAV.LOGO}</div>
      <ul className="nav-links">
        <li><Link to="/" className="active">{APP_STRINGS.NAV.HOME}</Link></li>
        <li><Link to="/interview">{APP_STRINGS.NAV.INTERVIEW}</Link></li>
        <li><Link to="/contact">{APP_STRINGS.NAV.CONTACT}</Link></li>
      </ul>
      <div className="auth-buttons">
        <button className="signup">{APP_STRINGS.NAV.SIGNUP}</button>
        <button className="login">{APP_STRINGS.NAV.LOGIN}</button>
      </div>
    </nav>
  );
}