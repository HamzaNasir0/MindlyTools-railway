import styles from "../styles/toolcard.module.css";

export default function ToolCard({ title, description, icon = "✨", onClick }) {
  return (
    <div className={styles.toolCard}>
      <div className={styles.toolCardContent}>
        <div className={styles.toolIcon}>{icon}</div>
        <h3 className={styles.toolTitle}>{title}</h3>
        <p className={styles.toolDescription}>{description}</p>
        <button className={styles.toolButton} onClick={onClick}>
          Open Tool
        </button>
      </div>
    </div>
  );
}
