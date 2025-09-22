"use client";
import React from "react";
import styles from "./mzTooltip.module.scss";
import MzIcon from "./mzIcon";

interface MzTooltipProps {
  text: string;
  children: React.ReactNode;
  icon: string;
}

const MzTooltip: React.FC<MzTooltipProps> = ({ text, children, icon }) => (
  <div className={styles.tooltipWrapper}>
    {children}
    <span className={styles.tooltip}>{text}</span>
    {/* <MzIcon icon={icon} /> */}
  </div>
);

export default MzTooltip;
