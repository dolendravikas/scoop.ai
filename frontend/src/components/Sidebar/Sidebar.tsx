"use client";

import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logo}>
          <h2 className={styles.logoTitle}>Scoop</h2>
          <p className={styles.logoSubtitle}>AI Intelligence</p>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <a href="#" className={styles.navLink}>
            <i className={`fas fa-home ${styles.navIcon}`}></i>
            Dashboard
          </a>
          <a href="#" className={styles.navLink}>
            <i className={`fas fa-search ${styles.navIcon}`}></i>
            Search
          </a>
          <a href="#" className={styles.navLink}>
            <i className={`fas fa-chart-line ${styles.navIcon}`}></i>
            Analytics
          </a>
          <a href="#" className={styles.navLink}>
            <i className={`fas fa-cog ${styles.navIcon}`}></i>
            Settings
          </a>
        </nav>

        {/* Upgrade Section */}
        <div className={styles.upgradeSection}>
          <h3 className={styles.upgradeTitle}>Upgrade Plan</h3>
          <p className={styles.upgradeDescription}>
            Get unlimited searches and advanced features
          </p>
          <button className={styles.upgradeButton}>Upgrade Now</button>
        </div>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <i className="fas fa-user"></i>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>User</p>
            <p className={styles.userPlan}>Free Plan</p>
          </div>
        </div>

        {/* Install Option */}
        <div className={styles.installSection}>
          <button className={styles.installButton}>
            <i className="fas fa-download"></i>
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}
