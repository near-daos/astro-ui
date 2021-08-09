import React, { FC, memo, ReactNode, useCallback } from 'react';
import cn from 'classnames';
import ReactModal from 'react-modal';

import { Icon } from 'components/Icon';
import { IconButton } from 'components/button/IconButton';

import styles from './modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: FC<ModalProps> = memo(
  ({ isOpen, onClose, children, size = 'md' }) => {
    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={handleClose}
        className={cn(styles.root, {
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
        <IconButton
          size="medium"
          onClick={handleClose}
          className={styles['close-wrapper']}
        >
          <Icon name="buttonAdd" className={styles.close} width={24} />
        </IconButton>
        <div>{children}</div>
      </ReactModal>
    );
  }
);
