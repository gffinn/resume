import styles from './NavBar.module.css';

export default function NavBar() {
    return (
        <nav className={styles.navBar}>
            <div className={styles.links}>
                <a href="/" className={styles.linkItem} >Home</a>
                <a href="/#CodingChallenges" className={styles.linkItem} >Engineering Challenges</a>
                <a href="/#Resume" className={styles.linkItem} >Resume</a>
                <div className={styles.initials}>GF</div>
            </div>
        </nav>
    );
}