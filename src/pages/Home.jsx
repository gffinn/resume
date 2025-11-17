import Styles from './Home.module.css';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import HoverIcon from '../components/HoverIcon';
import SiteDescription from '../components/SiteDescription';
import { IoDocumentText } from 'react-icons/io5';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaGears } from 'react-icons/fa6';
import { AiFillNotification } from 'react-icons/ai';
import { motion } from 'framer-motion';

const items = [
  {
    icon: IoDocumentText,
    text: 'Resume',
    url: '/Resume',
    newTab: false,
    desc: 'Checkout my resume. I really did all those things, and have stories to prove it.',
  },
  {
    icon: FaLinkedin,
    text: 'LinkedIn',
    url: 'https://www.linkedin.com/in/grant-f-finn/',
    newTab: true,
    desc: 'Follow me and see what doing 10 pushups a day taught me about B2B sales on LinkedIn.',
  },
  {
    icon: FaGithub,
    text: 'GitHub',
    url: 'https://github.com/gffinn',
    newTab: true,
    desc: 'Be my friend on GitHub too!',
  },
  // {
  //   icon: FaGears,
  //   text: "Coding Challenges",
  //   url: "/#CodingChallenges",
  //   newTab: false,
  // },
  // {
  //   icon: AiFillNotification,
  //   text: "Announcements",
  //   url: "/#Announcements",
  //   newTab: false,
  // },
];

export default function Home() {
  return (
    <div>
      <NavBar />
      <Header className={Styles.header} />
      <SiteDescription className={Styles.siteDescription} />
      <div className={Styles.timeline}>
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={
              index % 2 === 0 ? Styles.timelineItem : Styles.timelineItemReverse
            }
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Icon */}
            <div className={Styles.iconContainer}>
              <HoverIcon
                icon={item.icon}
                text={item.text}
                size={200}
                url={item.url}
                newTab={item.newTab}
              />
            </div>
            {/* Description */}
            {item.desc && (
              <div className={Styles.descriptionBox}>
                <p>{item.desc}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
