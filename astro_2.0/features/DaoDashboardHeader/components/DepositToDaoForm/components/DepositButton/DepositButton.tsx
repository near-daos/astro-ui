import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './DepositButton.module.scss';

export const DepositButton: React.FC = () => {
  const {
    formState: { isValid },
  } = useFormContext();

  return (
    <Button
      className={styles.depositButton}
      variant="transparent"
      size="block"
      type="submit"
      disabled={!isValid}
    >
      <Icon name="buttonDeposit" width={24} />
    </Button>
  );
};
