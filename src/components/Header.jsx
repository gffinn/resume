import React from 'react';
import styles from './Header.module.css'; 

const handleShowcaseClick = () => {
window.location.href = '/Practice';
};

const Header = () => (
    <header style={{ padding: '1rem', background: '#282c34', color: '#fff' }}>
        <h1 className={styles.title}>Grant F. Finn</h1>
        <p className={styles.subtitle}>Software Engineer | AI Student</p>
        <button className={styles.button} onClick={handleShowcaseClick}>Showcase</button>

    </header>
);

export default Header;