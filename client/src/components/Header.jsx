import Logo from "../components/Logo";
import HamburgerButton from "../components/HamburgerButton";
import styles from "../styles/header.module.css";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.innerContainer}>
          <a href="/" className={styles.logo}>
            <Logo />
          </a>

          <HamburgerButton
          isOpen={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className=""
          />
        </div>
        <nav className={styles.mainNav}>
          <ul className={styles.navList}>
            <li>
              <a href="#contact" className={styles.contactButton}>Contact Us</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
