import React from 'react';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, size = 'md', children }) => {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // Close on ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Close on click outside
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Focus management: trap simple (focus content on open)
  React.useEffect(() => {
    if (open) contentRef.current?.focus();
  }, [open]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className={[styles.overlay, open ? styles.overlayOpen : ''].join(' ')}
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <div
        tabIndex={-1}
        ref={contentRef}
        className={[styles.content, styles[size], open ? styles.contentOpen : ''].join(' ')}
      >
        {(title || onClose) ? (
          <div className={styles.header}>
            {title ? <div id="modal-title" className={styles.title}>{title}</div> : <div />}
            <button aria-label="Close" className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};



