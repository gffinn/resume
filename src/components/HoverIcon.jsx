import React from "react";
import styles from "./HoverIcon.module.css";

export default function HoverIcon({ icon: Icon, text, url, size = 96, color = "#333", className }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.hoverIcon} ${className || ""}`}
      style={{ "--size": `${size}px`, color }}
      aria-label={text}
    >
      <span className={styles.icon}><Icon /></span>
      <span className={styles.text}>{text}</span>
    </a>
  );
}
