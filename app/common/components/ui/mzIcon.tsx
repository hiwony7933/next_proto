"use client";
import React from "react";
import styles from "./mzIcon.module.scss";

interface MzIconProps {
  icon: string;
}

const MzIcon: React.FC<MzIconProps> = ({ icon }) => (
  <img src={icon} alt={icon} className={styles.icon} />
);

export default MzIcon;
