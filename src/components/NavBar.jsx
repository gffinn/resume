import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar() {
    return (
        <nav className={styles.navBar} aria-label="Main navigation">
            <div className={styles.links}>
                <Link to="/" className={styles.linkItem}>Home</Link>
                <Link to="/Resume" className={styles.linkItem}>Resume</Link>
                {/* <Link to="/CodingChallenges" className={styles.linkItem}>Engineering Challenges</Link> */}
                {/* <Link to="/Announcements" className={styles.linkItem}>Announcements</Link> */}
                <div className={styles.initials} aria-hidden="true">GF</div>
            </div>
        </nav>
    );
}