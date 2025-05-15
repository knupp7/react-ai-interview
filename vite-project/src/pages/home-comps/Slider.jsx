import { useState, useEffect } from "react";
import HOME_STRINGS from '../../constants/homeStrings';
import styles from "../../styles/Home.module.css";

const Slider = () => {
  const steps = HOME_STRINGS.SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextStep();
    }, 3000); // 3초 간격

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.slider}>
      <div className={styles.slide_wrapper}>
        {/* <div className={styles.slide_controller}> */}
        {/* <button onClick={prevStep}>&lt;</button> */}
        <div className={styles.dots}>
          {steps.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        {/* <button onClick={nextStep}>&gt;</button> */}
        {/* </div> */}
        <div className={styles.slide_box}>
          <div className={styles.slide_content}>
            <div className={styles.text_box}>
              <p className={styles.step_title}>
                <span className={styles.step_label}>{steps[currentIndex].title}</span>
              </p>
              <p className={styles.step_subtitle}>{steps[currentIndex].subtitle}</p>
              <p className={styles.step_desc}>{steps[currentIndex].description}</p>
            </div>
            <img
              src={steps[currentIndex].image}
              alt="step"
              className={styles.step_image}
            />
          </div>
        </div>
      </div>
      
    </section>
  );
}

export default Slider;