import styles from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm/components/DepositButton/DepositButton.module.scss';
import { Input } from 'components/inputs/Input';
import cn from 'classnames';
import { kFormatter } from 'utils/format';
import { Icon } from 'components/Icon';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useTranslation } from 'next-i18next';

export const DepositInput: React.FC = () => {
  const [inputInFocus, setInputInFocus] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    watch,
    formState: { isValid },
  } = useFormContext();

  const handleBlur = useCallback(() => {
    setInputInFocus(false);
  }, []);

  const handleFocus = useCallback(() => {
    setInputInFocus(true);
  }, []);

  const depositAmount = watch('depositAmount')?.toString() ?? 0;

  return (
    <div
      className={styles.inputWrapper}
      onFocus={handleFocus}
      tabIndex={0}
      role="button"
    >
      <div className={styles.inputLabel}>{t('depositToDao')}</div>
      {inputInFocus ? (
        <Input
          isBorderless
          autoFocus
          size="block"
          type="number"
          step="1"
          placeholder="0"
          className={cn(styles.input, { [styles.inputError]: !isValid })}
          {...register('depositAmount')}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className={cn(styles.valueHolder, styles.input, {
            [styles.inputError]: !isValid,
          })}
        >
          {kFormatter(Number(depositAmount), 5)}
        </div>
      )}
      <div className={styles.tokenIcon}>
        <Icon name="tokenNearBig" />
      </div>
      <div className={styles.tokenCaption}>NEAR</div>
    </div>
  );
};
