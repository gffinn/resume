import React from "react";
import styles from "./HoverIcon.module.css";

export default function HoverIcon({
  icon: Icon,
  text,
  url,
  size = 96,
  color = "#333",
  className,
  newTab = true, // ✅ default true so links open in new tab unless you override
}) {
  return (
    <a
      href={url}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={`${styles.hoverIcon} ${className || ""}`}
      style={{ "--size": `${size}px`, color }}
      aria-label={text}
    >
      <span className={styles.icon}>
        <Icon />
      </span>
      <span className={styles.text}>{text}</span>
    </a>
  );
}
