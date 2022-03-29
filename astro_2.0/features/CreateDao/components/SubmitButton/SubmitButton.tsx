import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './SubmitButton.module.scss';

interface SubmitButtonProps {
  disabled?: boolean;
  isSubmit?: boolean;
  className?: string;
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  disabled,
  isSubmit = false,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      type="submit"
      className={cn(styles.root, className)}
      disabled={disabled}
    >
      {!isSubmit ? (
        <>
          <span className={styles.text}>Next Step</span>
          <Icon name="buttonArrowRight" width={24} />
        </>
      ) : (
        <span className={styles.text}>{t('createDAO.createNewDAO')}</span>
      )}
    </Button>
  );
};
