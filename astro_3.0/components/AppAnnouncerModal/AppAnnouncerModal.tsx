import React, { FC, useCallback } from 'react';

import { Button } from 'components/button/Button';

import { useFlags } from 'launchdarkly-react-client-sdk';
import { useLocalStorage } from 'react-use';
import { motion } from 'framer-motion';

import styles from './AppAnnouncerModal.module.scss';

interface Props {
  title: string;
  message: string;
}

export const AppAnnouncerModal: FC<Props> = ({ title, message }) => {
  const { useApplicationAnnouncer } = useFlags();
  const [value, setValue] = useLocalStorage('astro-app-announcer-closed');

  const handleSubmit = useCallback(() => {
    setValue(true);
  }, [setValue]);

  if (useApplicationAnnouncer && !value) {
    return (
      <motion.div
        className={styles.root}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 5,
        }}
      >
        <motion.div
          className={styles.wrapper}
          transition={{
            delay: 6,
          }}
          initial={{ opacity: 0, transform: 'translateY(40px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
        >
          <div className={styles.title}>{title}</div>
          <div className={styles.message}>{message}</div>
          <div className={styles.footer}>
            <Button
              capitalize
              size="medium"
              variant="green"
              onClick={handleSubmit}
              data-testid="close-button"
              className={styles.confirmButton}
            >
              Ok
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return null;
};
