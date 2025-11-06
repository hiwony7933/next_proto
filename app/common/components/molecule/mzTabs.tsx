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
  solid?: boolean; // true: solid, false: border(default)
  onBeforeChange?: (
    fromIndex: number,
    toIndex: number
  ) => boolean | Promise<boolean>; // return true to allow change
}

const MzTabs: React.FC<MzTabsProps> = ({
  tabs,
  tabSize = true, // true: full width, false: shrink to content(default)
  solid = false, // true: solid, false: border(default)
  onBeforeChange,
}) => {
  const [active, setActive] = useState(0);

  const handleTabClick = async (nextIndex: number) => {
    if (nextIndex === active) return;
    if (onBeforeChange) {
      try {
        const allow = await onBeforeChange(active, nextIndex);
        if (!allow) return;
      } catch {
        return;
      }
    }
    setActive(nextIndex);
  };

  return (
    <div className={styles.tabs}>
      <div
        className={`${styles["tabs__list"]} ${
          tabSize ? styles["tabs__list--equal"] : styles["tabs__list--auto"]
        } ${solid ? styles["tabs__list--solid"] : styles["tabs__list--border"]}`}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`${styles["tabs__button"]} ${
              active === idx ? styles["tabs__button--active"] : ""
            }`}
            onClick={() => handleTabClick(idx)}
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
