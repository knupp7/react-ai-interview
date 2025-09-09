import { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import HOME_STRINGS from '../constants/homeStrings';
import HomeBanner from './home-comps/HomeBanner';
// import Slider from './home-comps/Slider';
import { useNavigate } from "react-router-dom";
import FullSnapper from './home-comps/FullSnapper';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);
  
  const handleStartClick = () => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/interview");
    }
  };

  return (
    <div className={styles.snap_container}>
      {/* Section 1: Banner */}
      <section className={styles.snap_section}>
          <HomeBanner />
          <button className={styles.start_button} onClick={handleStartClick}>
            {HOME_STRINGS.HERO.START_BUTTON}
          </button>
      </section>

      {/* 섹션 2~4: Slider가 내부에서 3개 섹션을 렌더 */}
      <FullSnapper />
    </div>
    
    // <div className={styles.home_container}>
    //   <HomeBanner />
    //   <button className={styles.start_button} onClick={handleStartClick}>
    //     {HOME_STRINGS.HERO.START_BUTTON}
    //   </button>
    //   <Slider />
    // </div>
  );
}