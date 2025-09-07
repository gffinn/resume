import styles from "./Home.module.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import HoverIcon from "../components/HoverIcon";
import { IoDocumentText } from "react-icons/io5";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { AiFillNotification } from "react-icons/ai";

export default function Home() {
  return (
    <div>
      <NavBar />
      <Header />
      <div className={styles.icons}>
        <HoverIcon
          icon={IoDocumentText}
          text="Resume"
          size={250}
          url="/Resume"
          newTab={false}
        />
        <HoverIcon
          icon={FaLinkedin}
          text="LinkedIn"
          size={250}
          url="https://www.linkedin.com/in/grant-f-finn/"
        />
        <HoverIcon
          size={250}
          icon={FaGithub}
          text="GitHub"
          url="https://github.com/gffinn"
        />
      </div>
      <div className={styles.icons}>
        <HoverIcon
          size={250}
          icon={FaGears}
          text="Coding Challenges"
          url="/#CodingChallenges"
          newTab={false}
        />
        <HoverIcon
          size={250}
          icon={AiFillNotification}
          text="Announcements"
          url="/#Announcements"
          newTab={false}
        />
      </div>
    </div>

  );
}