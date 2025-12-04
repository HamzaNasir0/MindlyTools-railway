import styles from "../styles/footer.module.css";

export default function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        © {date} MindlyTools | All rights reserved.
      </div>
    </footer>
  );
}