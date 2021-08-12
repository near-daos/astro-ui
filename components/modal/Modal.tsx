import React, { FC, memo, ReactNode, useCallback } from 'react';
import cn from 'classnames';
import ReactModal from 'react-modal';

import { IconButton } from 'components/button/IconButton';

import styles from './modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    hideCloseIcon
  }) => {
    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={handleClose}
        className={cn(styles.root, className, {
          [styles.sm]: size === 'sm',
          [styles.md]: size === 'md',
          [styles.lg]: size === 'lg',
          [styles.xl]: size === 'xl'
        })}
        overlayClassName={{
          base: styles.overlay,
          afterOpen: styles['overlay-after-open'],
          beforeClose: styles['overlay-before-close']
        }}
        shouldCloseOnEsc
        closeTimeoutMS={300}
      >
        {!hideCloseIcon && (
          <IconButton
            icon="buttonAdd"
            size="medium"
            onClick={handleClose}
            className={styles['close-wrapper']}
          />
        )}
        <div>{children}</div>
      </ReactModal>
    );
  }
);
