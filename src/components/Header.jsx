import React from 'react';
import styles from './Header.module.css'; 

const Header = () => (
    <header style={{ padding: '1rem', background: '#282c34', color: '#fff' }}>
        <h1 className={styles.title}>Grant F. Finn</h1>
    </header>
);

export default Header;