import React from 'react';
import styles from './AppShell.module.css';

export interface AppShellProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ header, footer, children }) => {
  return (
    <div className={styles.root}>
      {header}
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      {footer}
    </div>
  );
};



