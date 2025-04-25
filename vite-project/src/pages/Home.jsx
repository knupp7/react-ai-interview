import React, { useState } from 'react';
import '../styles/Home.css';
import STRINGS from '../constants/homeStrings';

const steps = STRINGS.SLIDES;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">{STRINGS.NAV.LOGO}</div>
        <ul className="nav-links">
          <li className="active">{STRINGS.NAV.HOME}</li>
          <li>{STRINGS.NAV.INTERVIEW}</li>
          <li>{STRINGS.NAV.CONTACT}</li>
        </ul>
        <div className="auth-buttons">
          <button className="signup">{STRINGS.NAV.SIGNUP}</button>
          <button className="login">{STRINGS.NAV.LOGIN}</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-center">
          <h1>{STRINGS.HERO.TITLE}</h1>
          <h2>{STRINGS.HERO.SUBTITLE}</h2>

          <div className="avatar-wrapper">
            <span className="hero-tag left">{STRINGS.HERO.TAG_LEFT}</span>
            <img src="/avatar-placeholder.svg" alt="avatar" className="avatar" />
            <span className="hero-tag right">{STRINGS.HERO.TAG_RIGHT}</span>
          </div>
        </div>
    </div>

      <div className="">
        <button className="start-button">{STRINGS.HERO.START_BUTTON}</button>
      </div>

      <section className="slider">
        <div className="slider-top-controls">
          <button onClick={prevStep}>&lt;</button>
          <div className="dots">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <button onClick={nextStep}>&gt;</button>
        </div>

        <div className="slide-box">
          <div className="slide-content">
            <div className="text-box">
            <p className="step-title">
              <span className="step-label">{steps[currentIndex].title}</span>
            </p>
            <p className="step-subtitle">{steps[currentIndex].subtitle}</p>
            <p className="step-desc">{steps[currentIndex].description}</p>
            </div>
            <img
              src={steps[currentIndex].image}
              alt="step"
              className="step-image"
            />
          </div>
        </div>
      </section>
    </div>
  );
}