import styles from '../styles/Home.module.css';
import HOME_STRINGS from '../constants/homeStrings';
import HomeBanner from './home-comps/HomeBanner';
import Slider from './home-comps/Slider';

export default function Home() {
  return (
    <div className={styles.home_container}>
      <HomeBanner />
      <button className={styles.start_button}>{HOME_STRINGS.HERO.START_BUTTON}</button>
      <Slider />
    </div>
  );
}