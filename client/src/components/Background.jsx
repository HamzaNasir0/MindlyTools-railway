import styles from "../styles/background.module.css";

export default function Background({ children }) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundLayer}>
        <div className={styles.gridOverlay}></div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}