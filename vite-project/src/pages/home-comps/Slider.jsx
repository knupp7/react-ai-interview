import { useState } from "react";
import HOME_STRINGS from '../../constants/homeStrings';

const Slider = () => {
  const steps = HOME_STRINGS.SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
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
  );
}

export default Slider;