import styles from '../styles/Home.module.css';
import HOME_STRINGS from '../constants/homeStrings';
import HomeBanner from './home-comps/HomeBanner';
import Slider from './home-comps/Slider';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  const handleStartClick = () => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/interview");
    }
  };

  return (
    <div className={styles.home_container}>
      <HomeBanner />
      <button className={styles.start_button} onClick={handleStartClick}>
        {HOME_STRINGS.HERO.START_BUTTON}
      </button>
      <Slider />
    </div>
  );
}