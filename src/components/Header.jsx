import styles from './Header.module.css';
import '../Styles/sharedHeader.css';

export default function Header(){
return (
    <header className={styles.background}>
        <h1 className="animatedTitle">Grant F. Finn</h1>
    </header>
);
}