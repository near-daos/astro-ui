import React, { FC, useCallback } from 'react';

import { Button } from 'components/button/Button';

import { useLocalStorage } from 'react-use';
import { motion } from 'framer-motion';

import styles from './CookiePolicyDisclaimer.module.scss';

interface Props {
  title?: string;
  message: string;
}

export const CookiePolicyDisclaimer: FC<Props> = ({ title, message }) => {
  const [value, setValue] = useLocalStorage(
    'astro-app-cookie-policy-disclaimer-closed'
  );

  const handleSubmit = useCallback(() => {
    setValue(true);
  }, [setValue]);

  if (!value) {
    return (
      <motion.div
        className={styles.wrapper}
        transition={{
          delay: 4,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{message}</div>
        <div className={styles.footer}>
          <Button
            capitalize
            size="medium"
            variant="primary"
            onClick={handleSubmit}
            data-testid="close-button"
            className={styles.confirmButton}
          >
            Accept
          </Button>
        </div>
      </motion.div>
    );
  }

  return null;
};
