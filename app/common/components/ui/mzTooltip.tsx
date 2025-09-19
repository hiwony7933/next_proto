'use client';
import React from 'react';
import styles from './mzTooltip.module.scss';

interface MzTooltipProps {
  text: string;
  children: React.ReactNode;
}

const MzTooltip: React.FC<MzTooltipProps> = ({ text, children }) => (
  <div className={styles.tooltipWrapper}>
    {children}
    <span className={styles.tooltip}>{text}</span>
  </div>
);

export default MzTooltip;
