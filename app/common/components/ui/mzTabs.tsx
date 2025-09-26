"use client";
import React, { useState } from "react";
import styles from "./mzTabs.module.scss";

interface Tab {
  label: string;
  content: React.ReactNode;
}
interface MzTabsProps {
  tabs: Tab[];
  tabSize?: boolean; // true: full width, false: shrink to content
  solid?: boolean; // true: solid, false: border
}

const MzTabs: React.FC<MzTabsProps> = ({
  tabs,
  tabSize = true,
  solid = false,
}) => {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.tabs}>
      <div
        className={`${styles["tabs__list"]} ${
          tabSize ? styles["tabs__list--equal"] : styles["tabs__list--auto"]
        } ${solid ? styles["tabs__list--solid"] : ""}`}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`${styles["tabs__button"]} ${
              active === idx ? styles["tabs__button--active"] : ""
            }`}
            onClick={() => setActive(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles["tabs__content"]}>{tabs[active].content}</div>
    </div>
  );
};

export default MzTabs;
