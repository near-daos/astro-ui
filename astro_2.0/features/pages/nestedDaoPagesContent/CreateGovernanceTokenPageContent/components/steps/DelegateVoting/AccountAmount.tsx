import React, { useRef, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import get from 'lodash/get';

import { DebouncedInput } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { useWalletContext } from 'context/WalletContext';

import styles from './DelegateVoting.module.scss';

interface Props {
  item: { name: string; amount: number };
  index: number;
  onRemove: () => void;
}

export const AccountAmount: VFC<Props> = ({ index, onRemove }) => {
  const {
    register,
    watch,
    setValue: setFormValue,
    formState: { errors },
  } = useFormContext();
  const { accountId } = useWalletContext();

  const errorEl = useRef<HTMLDivElement>(null);

  const currentValue = watch(`accounts.${index}`);
  const error = get(errors, `accounts.${index}`);

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.row}>
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <DebouncedInput
              inputClassName={cn({
                [styles.error]: !!error?.name,
              })}
              label={index === 0 ? 'Account' : ''}
              placeholder=""
              {...register(`accounts.${index}.name`)}
              defaultValue={currentValue.name}
              onValueChange={val => {
                setFormValue(
                  `accounts.${index}`,
                  { ...currentValue, name: val },
                  {
                    shouldValidate: true,
                  }
                );
              }}
              size="block"
            />
          }
        />
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <DebouncedInput
              className={cn({
                [styles.error]: !!error?.amount,
              })}
              label={index === 0 ? 'Amount' : ''}
              placeholder=""
              type="number"
              {...register(`accounts.${index}.amount`)}
              defaultValue={currentValue.amount}
              onValueChange={val => {
                setFormValue(
                  `accounts.${index}`,
                  { ...currentValue, amount: val },
                  {
                    shouldValidate: true,
                  }
                );
              }}
              size="small"
            />
          }
        />

        <IconButton
          disabled={currentValue === accountId}
          className={styles.deleteBtn}
          icon="buttonDelete"
          onClick={onRemove}
          size="small"
        />
      </div>
      <div ref={errorEl} />
    </div>
  );
};
