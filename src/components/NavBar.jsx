import styles from './NavBar.module.css';

export default function NavBar() {
    return (
        <nav className={styles.navBar}>
            <div className={styles.links}>
                <a href="/" className={styles.linkItem} >Home</a>
<<<<<<< HEAD
                <a href="/#CodingChallenges" className={styles.linkItem} >Engineering Challenges</a>
                <a href="/#Resume" className={styles.linkItem} >Resume</a>
=======
                <a href="/#Resume" className={styles.linkItem} >Resume</a>
                <a href="/#CodingChallenges" className={styles.linkItem} >Engineering Challenges</a>
>>>>>>> 431de5e1af2e7a01c1115976311db00006c18c03
                <a href="/#Announcements" className={styles.linkItem} >Announcements</a>
                <div className={styles.initials}>GF</div>
            </div>
        </nav>
    );
}