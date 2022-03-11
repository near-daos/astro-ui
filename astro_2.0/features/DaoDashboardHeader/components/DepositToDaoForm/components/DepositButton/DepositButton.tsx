import React from 'react';
import { Button } from 'components/button/Button';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import styles from './DepositButton.module.scss';

export const DepositButton: React.FC = () => {
  const { t } = useTranslation();

  const {
    formState: { isValid },
  } = useFormContext();

  const renderButton = () => {
    return (
      <Button
        className={styles.depositButton}
        variant="secondary"
        size="small"
        type="submit"
        disabled={!isValid}
      >
        {t('depositToDao')}
      </Button>
    );
  };

  return isValid ? (
    <div className={styles.flex}>{renderButton()}</div>
  ) : (
    <Tooltip overlay="Fill in the field first" className={styles.flex}>
      {renderButton()}
    </Tooltip>
  );
};
