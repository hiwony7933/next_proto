'use client';
import React, { useState } from 'react';
import styles from './mzTabs.module.scss';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface MzTabsProps {
  tabs: Tab[];
}

const MzTabs: React.FC<MzTabsProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabList}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={active === idx ? styles.active : ''}
            onClick={() => setActive(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{tabs[active].content}</div>
    </div>
  );
};

export default MzTabs;
