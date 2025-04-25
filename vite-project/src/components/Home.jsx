import React, { useState } from 'react';
import '../styles/Home.css';

const steps = [
  {
    title: 'STEP 1',
    description: '면접관 페르소나와 인터뷰 시작',
    subtitle: '면접관 페르소나',
    image: '/step1-persona.png',
  },
  {
    title: 'STEP 2',
    description: '직무, 자소서 기반 맞춤 질문 생성',
    subtitle: '맞춤 질문',
    image: '/step2-example.png',
  },
  {
    title: 'STEP 3',
    description: 'AI가 답변을 분석하여 종합리포트를 제공합니다.',
    subtitle: '종합리포트 제공',
    image: '/step3-report.png',
  },
];

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
        <div className="logo">🧊 Duri–Intern</div>
        <ul className="nav-links">
          <li className="active">Home</li>
          <li>Interview</li>
          <li>Contact</li>
        </ul>
        <div className="auth-buttons">
          <button className="signup">회원가입</button>
          <button className="login">로그인</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-center">
          <h1>합격을 결정짓는</h1>
          <h2>Ai 모의면접</h2>

          <div className="avatar-wrapper">
            <span className="hero-tag left">직무, 자소서, 회사 맞춤 질문으로 완벽 대비</span>
            <img src="/avatar-placeholder.svg" alt="avatar" className="avatar" />
            <span className="hero-tag right">면접 끝나고 바로 받는 AI 분석리포트</span>
          </div>
        </div>
    </div>

      <div className="">
        <button className="start-button">지금 바로 시작하기</button>
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