import styles from "../styles/hamburgerbutton.module.css";

export default function HamburgerButton({ isOpen, onClick, className = "" }) {
  return (
    <button
      className={`${styles.hamburgerBtn} ${isOpen ? styles.open : ""} ${className}`}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span className={styles.line}></span>
    </button>
  );
}