import React, { ReactElement } from 'react';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import styles from './ListModal.module.scss';

export interface Props<T> {
  isOpen: boolean;
  onClose: (val?: string) => void;
  data: T[];
  renderItem: (item: T) => ReactElement;
  title: string;
}

export const ListModal = <T,>({
  isOpen,
  onClose,
  data,
  renderItem,
  title,
}: Props<T>): ReactElement => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>{title}</div>
        <div className={styles.list}>{data.map(item => renderItem(item))}</div>

        <div className={styles.footer}>
          <Button
            capitalize
            className={styles.confirmButton}
            size="medium"
            onClick={() => onClose()}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
