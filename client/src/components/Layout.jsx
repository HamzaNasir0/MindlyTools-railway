import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Background from "./Background";
import styles from "../styles/layout.module.css";

export default function Layout({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      // Prevent scrolling when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when sidebar is closed
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <Background>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={styles.layoutContainer}>
        <Sidebar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          {children}
        </main>
      </div>
      <Footer />
    </Background>
  );
}
