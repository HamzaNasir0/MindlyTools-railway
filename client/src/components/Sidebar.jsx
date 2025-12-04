import { useEffect, useState } from "react";
import { auth } from "../firebase";
import styles from "../styles/sidebar.module.css";

export default function Sidebar({ user, sidebarOpen, setSidebarOpen }) {
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    const tz =
      user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/";
  };

  const profile = async () => {
    window.location.href = "/profile";
  };

  const about = async () => {
    window.location.href = "/about";
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.sidebarBackdrop} ${
          sidebarOpen ? styles.active : ""
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : styles.collapsed
        }`}
        style={{ paddingTop: "90px" }}
      >
        {/* Profile Picture */}
        <img
          src={
            user?.picture
              ? user.picture
              : "https://ui-avatars.com/api/?name=User&background=444&color=fff&rounded=true&size=128"
          }
          alt="Profile"
          className={styles.sidebarProfile}
        />

        {/* Username */}
        {sidebarOpen && (
          <h3 className={styles.sidebarUsername}>
            {user?.username || user?.name}
          </h3>
        )}

        {/* Timezone */}
        {sidebarOpen && <p className={styles.sidebarTimezone}>🕓 {timezone}</p>}

        {/* Main Buttons */}
        {sidebarOpen && (
          <button className={styles.sidebarBtn} onClick={profile}>
            Profile
          </button>
        )}

        {sidebarOpen && (
          <button className={styles.sidebarBtn} onClick={about}>
            About
          </button>
        )}

        <div className={styles.sidebarSpacer}></div>

        {/* Logout Button */}
        <button className={styles.sidebarLogoutBtn} onClick={handleLogout}>
          {sidebarOpen ? (
            <>
              <span>⏻</span>
              Logout
            </>
          ) : (
            "⏻"
          )}
        </button>
      </div>
    </>
  );
}
