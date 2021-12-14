import React, { FC, memo, ReactNode, useCallback, useState } from 'react';
import cn from 'classnames';
import ReactModal from 'react-modal';

import { IconButton } from 'components/button/IconButton';

import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  hideCloseIcon?: boolean;
}

export const Modal: FC<ModalProps> = memo(
  ({
    isOpen,
    onClose,
    children,
    size = 'md',
    className = '',
    hideCloseIcon,
  }) => {
    const [open, setOpen] = useState(isOpen);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <ReactModal
        ariaHideApp={false}
        bodyOpenClassName={styles.modalOpen}
        isOpen={open}
        onAfterClose={handleClose}
        onRequestClose={() => setOpen(false)}
        className={{
          base: cn(styles.root, className, {
            [styles.sm]: size === 'sm',
            [styles.md]: size === 'md',
            [styles.lg]: size === 'lg',
            [styles.xl]: size === 'xl',
            [styles.xxl]: size === 'xxl',
          }),
          afterOpen: styles.contentAfterOpen,
          beforeClose: styles.contentBeforeClose,
        }}
        overlayClassName={{
          base: styles.overlay,
          afterOpen: styles.overlayAfterOpen,
          beforeClose: styles.overlayBeforeClose,
        }}
        shouldCloseOnEsc
        closeTimeoutMS={300}
      >
        {!hideCloseIcon && (
          <IconButton
            icon="close"
            size="large"
            onClick={() => setOpen(false)}
            className={styles.closeWrapper}
          />
        )}
        <div>{children}</div>
      </ReactModal>
    );
  }
);
