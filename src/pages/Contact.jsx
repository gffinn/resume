import ContactForm from '../components/ContactForm';
import NavBar from '../components/NavBar';
import styles from './Contact.module.css';

export default function Contact({ className }) {
  return (
    <div className={`${styles.contactPage} ${className || ''}`}>
      <NavBar />
      <ContactForm />
    </div>
  );
}
