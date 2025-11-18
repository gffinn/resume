import styles from './ResumeHeader.module.css';
import '../Styles/sharedHeader.css';

export default function ResumeHeader() {
  return (
    <header className={styles.background}>
      <h1 className="animatedTitle">Grant F. Finn</h1>
      {/*      <p className="sharedSubtitle">Software Engineer | Web Dev | AI Student</p>
       */}
    </header>
  );
}