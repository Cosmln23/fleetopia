import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  className,
  disabled,
  children,
  ...rest
}) => {
  const classes = [styles.btn, styles[variant], styles[size]];
  if (loading) classes.push(styles.loading);
  if (disabled) classes.push(styles.disabled);
  if (className) classes.push(className);

  return (
    <button
      className={classes.join(' ')}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {leftIcon ? <span className={styles.icon} aria-hidden>{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className={styles.icon} aria-hidden>{rightIcon}</span> : null}
    </button>
  );
};



