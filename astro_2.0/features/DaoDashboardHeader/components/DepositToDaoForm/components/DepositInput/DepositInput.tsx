import { Input } from 'components/inputs/Input';
import cn from 'classnames';
import { kFormatter } from 'utils/format';
import { Icon } from 'components/Icon';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useTranslation } from 'next-i18next';
import styles from './DepositInput.module.scss';

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
      <div className={styles.tokenIcon}>
        <Icon name="tokenNearBig" width={20} />
      </div>
      <div className={styles.tokenCaption}>NEAR</div>
      {(inputInFocus || !!depositAmount) && (
        <div className={styles.inputLabel}>{t('depositToDao')}</div>
      )}
      {inputInFocus ? (
        <Input
          isBorderless
          autoFocus
          size="block"
          type="number"
          step="1"
          className={cn(styles.input, { [styles.inputError]: !isValid })}
          {...register('depositAmount')}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className={cn(styles.valueHolder, styles.input, {
            [styles.inputError]: !isValid,
            [styles.placeholder]: !depositAmount,
          })}
        >
          {depositAmount
            ? kFormatter(Number(depositAmount), 5)
            : 'Deposit to DAO'}
        </div>
      )}
    </div>
  );
};
