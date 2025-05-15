import React from 'react';
import APP_STRINGS from '../constants/appStrings';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>{APP_STRINGS.NAV.LOGO}</div>
      <ul className={styles.navLinks}>
        <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>{APP_STRINGS.NAV.HOME}</NavLink></li>
        <li><NavLink to="/interview" className={({ isActive }) => isActive ? styles.active : ''}>{APP_STRINGS.NAV.INTERVIEW}</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ''}>{APP_STRINGS.NAV.CONTACT}</NavLink></li>
      </ul>
      <div className={styles.authButtons}>
        <button className={styles.signup} onClick={handleSignUpClick}>{APP_STRINGS.NAV.SIGNUP}</button>
        <button className={styles.login} onClick={handleLoginClick}>{APP_STRINGS.NAV.LOGIN}</button>
      </div>
    </nav>
  );
}