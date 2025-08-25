import React from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <div className={styles.root}>
      <div className="flex items-center justify-between gap-3">
        <h1 className={styles.title}>{title}</h1>
        {right}
      </div>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
};



