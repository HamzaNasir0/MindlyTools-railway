import GoogleLoginButton from "../components/GoogleLoginButton";
import Logo from "../components/Logo"
import styles from "../styles/login.module.css";

export default function Login() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.backgroundLayer}>
        <div className={styles.gridOverlay}></div>
      </div>

      <div className={styles.loginCard}>
        <header className={styles.cardHeader}>
          <Logo />
        </header>

        <section className={styles.cardBody}>
          <p className={styles.cardBodyText}>Elevate Your Productivity</p>
          <p className={styles.cardBodyText}>Sign in to continue your journey</p>
          <div className={styles.divider}></div>
          <GoogleLoginButton />
        </section>

        <footer className={styles.cardFooter}>
          Secure login · Your data is protected
        </footer>
      </div>
    </div>
  );
}