"use client";
import React from "react";
import styles from "./mzTooltip.module.scss";

interface MzTooltipProps {
  text?: string;
  children: React.ReactNode;
  icon?: string;
}

const MzTooltip: React.FC<MzTooltipProps> = ({ text, children, icon }) => (
  <div className={styles.tooltip__container}>
    {children}
    {text && <span className={styles.tooltip}>{text}</span>}
  </div>
);

export default MzTooltip;
