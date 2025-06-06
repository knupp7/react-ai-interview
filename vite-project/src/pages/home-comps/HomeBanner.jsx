import HOME_STRINGS from '../../constants/homeStrings';
import styles from "../../styles/Home.module.css";
// import style from "../styles/HomeBanner.module.css";

const HomeBanner = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero_center}>
        <h1><span>{HOME_STRINGS.HERO.TITLE}</span> {HOME_STRINGS.HERO.SUBTITLE}</h1>

        <div className={styles.avatar_wrapper}>
          <span className={`${styles.hero_tag} ${styles.left}`}>{HOME_STRINGS.HERO.TAG_LEFT}</span>
          <img src="/avatar-placeholder.svg" alt="avatar" className={styles.avatar} />
          <span className={`${styles.hero_tag} ${styles.right}`}>{HOME_STRINGS.HERO.TAG_RIGHT}</span>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;