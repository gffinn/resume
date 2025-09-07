import styles from './Header.module.css'; 

export default function Header(){
return (
    <header className={styles.background}>
        <h1 className={styles.title}>Grant F. Finn</h1>
        <p className={styles.subtitle}>Software Engineer | Web Dev | AI Student</p>
    </header>
);
}