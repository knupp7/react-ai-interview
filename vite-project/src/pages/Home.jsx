import React, { useState } from 'react';
import '../styles/Home.css';
import HOME_STRINGS from '../constants/homeStrings';

const steps = HOME_STRINGS.SLIDES;

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
      <div className="hero">
        <div className="hero-center">
          <h1>{HOME_STRINGS.HERO.TITLE}</h1>
          <h2>{HOME_STRINGS.HERO.SUBTITLE}</h2>

          <div className="avatar-wrapper">
            <span className="hero-tag left">{HOME_STRINGS.HERO.TAG_LEFT}</span>
            <img src="/avatar-placeholder.svg" alt="avatar" className="avatar" />
            <span className="hero-tag right">{HOME_STRINGS.HERO.TAG_RIGHT}</span>
          </div>
        </div>
    </div>

      <div className="">
        <button className="start-button">{HOME_STRINGS.HERO.START_BUTTON}</button>
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