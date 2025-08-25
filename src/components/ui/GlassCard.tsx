import React from 'react';
import styles from './GlassCard.module.css';

export type GlassCardVariant = 'default' | 'elevated' | 'interactive';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
  gradientBorder?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  gradientBorder = false,
  className,
  children,
  ...rest
}) => {
  const classes = [styles.card];
  if (variant === 'elevated') classes.push(styles.elevated);
  if (variant === 'interactive') classes.push(styles.interactive);
  if (gradientBorder) classes.push(styles.gradientBorder);
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} {...rest}>
      {children}
    </div>
  );
};



