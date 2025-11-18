import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar() {
  const location = useLocation();
  const isResumePage = location.pathname === '/Resume';

  return (
    <nav
      className={`${styles.navBar} ${isResumePage ? styles.blackNav : ''}`}
      aria-label="Main navigation"
    >
      <div className={styles.links}>
        <Link to="/" className={styles.linkItem}>
          Home
        </Link>
        <Link to="/Resume" className={styles.linkItem}>
          Resume
        </Link>
        <Link to="/Contact" className={styles.linkItem}>
          Contact
        </Link>
        {/* <Link to="/Announcements" className={styles.linkItem}>Announcements</Link> */}
        <div className={styles.initials} aria-hidden="true">
          GF
        </div>
      </div>
    </nav>
  );
}
