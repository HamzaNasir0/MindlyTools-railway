import styles from "../styles/logo.module.css";

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <h1 className={styles.mainLogo}>
        <span className={styles.charM}>M</span>
        <span className={styles.charI}>i</span>
        <span className={styles.charN}>n</span>
        <span className={styles.charD}>d</span>
        <span className={styles.charL}>l</span>
        <span className={styles.charY}>y</span>
        <span className={styles.charT}>T</span>
        <span className={styles.charO}>o</span>
        <span className={styles.charO2}>o</span>
        <span className={styles.charL2}>l</span>
        <span className={styles.charS}>s</span>
      </h1>
    </div>
  );
}
