import HOME_STRINGS from '../../constants/homeStrings';
import styles from "../../styles/HomeBanner.module.css";

const HomeBanner = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero_center}>
        <h2>{HOME_STRINGS.HERO.TITLE}</h2>
        <div className={styles.vr}></div>
        <h1>{HOME_STRINGS.HERO.SUBTITLE}</h1>
      </div>

      {/* <div className={styles.avatar_wrapper}>
        <span className={`${styles.hero_tag} ${styles.left}`}>{HOME_STRINGS.HERO.TAG_LEFT}</span>
        <img src="/avatar-placeholder.svg" alt="avatar" className={styles.avatar} />
        <span className={`${styles.hero_tag} ${styles.right}`}>{HOME_STRINGS.HERO.TAG_RIGHT}</span>
      </div> */}

    </div>
  );
}

export default HomeBanner;