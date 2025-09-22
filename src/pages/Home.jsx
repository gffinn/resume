import styles from "./Home.module.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import HoverIcon from "../components/HoverIcon";
import { IoDocumentText } from "react-icons/io5";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { AiFillNotification } from "react-icons/ai";
import { motion } from "framer-motion";

const items = [
  {
    icon: IoDocumentText,
    text: "Resume",
    url: "/#Resume",
    newTab: false,
  },
  {
    icon: FaLinkedin,
    text: "LinkedIn",
    url: "https://www.linkedin.com/in/grant-f-finn/",
    newTab: true,
  },
  {
    icon: FaGithub,
    text: "GitHub",
    url: "https://github.com/gffinn",
    newTab: true,
  },
  {
    icon: FaGears,
    text: "Coding Challenges",
    url: "/#CodingChallenges",
    newTab: false,
  },
  {
    icon: AiFillNotification,
    text: "Announcements",
    url: "/#Announcements",
    newTab: false,
  },
];

export default function Home() {
  return (
    <div>
      <NavBar />
      <Header />
      <div className={styles.timeline}>
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center w-full max-w-4xl ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Icon */}
            <div className="flex-shrink-0 p-4">
              <HoverIcon
                icon={item.icon}
                text={item.text}
                size={200}
                url={item.url}
                newTab={item.newTab}
              />
            </div>

            {/* Text */}
            <div className="p-4 bg-gray-100 rounded-xl shadow-md text-lg">
              {item.text}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
