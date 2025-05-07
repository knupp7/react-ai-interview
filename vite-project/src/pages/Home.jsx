import '../styles/Home.css';
import HOME_STRINGS from '../constants/homeStrings';
import HomeBanner from './home-comps/HomeBanner';
import Slider from './home-comps/Slider';

export default function Home() {
  return (
    <div className="home-container">
      <HomeBanner />
      <button className="start-button">{HOME_STRINGS.HERO.START_BUTTON}</button>
      <Slider />
    </div>
  );
}