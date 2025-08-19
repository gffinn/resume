import React from "react";
import styles from "./Home.module.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import HoverIcon from "../components/HoverIcon";
import { IoDocumentText } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function Home() {
  return (
    <div>
      <NavBar />
      <Header />
      <div className={styles.background} style={{ padding: "2rem", textAlign: "center" }}>
        <p>Welcome to my personal portfolio</p>
        <p>I plan to have bi-weekkly deployments</p>
        <li>First Style - I am working on bringing in some style</li>
        <li>Functionality - I am going to add some new functionality and test out some different 'challenges'</li>
        <li>Resume - I intend this to be used as my portfolio as well as my resume</li>
      </div>
      <div className={styles.background}>
        <HoverIcon
          icon={IoDocumentText}
          text="Resume"
          size={250}

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
    </div>

  );
}

export default Home;
