import React, { FC } from 'react';
import { useLockBodyScroll } from 'react-use';

import { Button } from 'components/button/Button';

import styles from './MobileFullscreenPopup.module.scss';

interface Props {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export const MobileFullscreenPopup: FC<Props> = ({
  title,
  children,
  submitLabel,
  onSubmit,
  onClose,
}) => {
  useLockBodyScroll(true);

  return (
    <div className={styles.root}>
      <section className={styles.header}>
        <h3>{title}</h3>
      </section>
      <section className={styles.body}>{children}</section>
      <section className={styles.footer}>
        <Button
          variant="secondary"
          size="flex"
          className={styles.button}
          capitalize
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="green"
          size="flex"
          className={styles.button}
          capitalize
          onClick={onSubmit}
        >
          {submitLabel ?? 'Submit'}
        </Button>
      </section>
    </div>
  );
};
