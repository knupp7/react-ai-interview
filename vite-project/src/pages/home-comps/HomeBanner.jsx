import HOME_STRINGS from '../../constants/homeStrings';
// import style from "../styles/HomeBanner.module.css";

const HomeBanner = () => {
  return (
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
  );
}

export default HomeBanner;