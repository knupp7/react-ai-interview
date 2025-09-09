import HOME_STRINGS from '../../constants/homeStrings';
// import styles from "../../styles/Home.module.css";
import styles from "../../styles/FullSnapper.module.css";
import StartButton from './StartButton';

const FullSnapper = () => {
  const steps = HOME_STRINGS.SLIDES;

  return (
      <section className={styles.snap_section}>
        <div className={styles.wrapper}>
          {steps.map((step, i) => (
            <div className={styles.content} key={i}>
              <div className={styles.marker}><p>{i + 1}</p></div>
              <div className={styles.text_box}>
                <p className={styles.step_title}>
                  <span className={styles.step_label}>{step.title}</span>
                </p>
                <p className={styles.step_desc}>{step.description}</p>
              </div>
              {/* <img src={step.image} alt="step" className={styles.step_image} /> */}
            </div>
          ))}
        </div>
        <StartButton />
      </section>
  );
}

export default FullSnapper;