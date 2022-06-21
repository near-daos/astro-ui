import React, { FC } from 'react';
import Link from 'next/link';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';

import { SINGLE_DAO_PAGE } from 'constants/routing';

import styles from './DaosListModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: string) => void;
  daos: { id: string }[];
}

export const DaosListModal: FC<Props> = ({ isOpen, onClose, daos }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.root}>
        <div className={styles.title}>Duplicated to</div>
        <div className={styles.list}>
          {daos.map(({ id }) => (
            <div
              key={id}
              className={styles.listItem}
              onClick={() => onClose()}
              onKeyPress={() => onClose()}
              tabIndex={0}
              role="button"
            >
              <Link
                passHref
                href={{
                  pathname: SINGLE_DAO_PAGE,
                  query: { dao: id },
                }}
              >
                <a className={styles.link}>{id}</a>
              </Link>
            </div>
          ))}
        </div>

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
