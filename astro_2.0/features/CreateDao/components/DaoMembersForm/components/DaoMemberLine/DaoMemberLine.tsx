import React, { useRef, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import get from 'lodash/get';

import { DebouncedInput } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { useAuthContext } from 'context/AuthContext';

import styles from './DaoMemberLine.module.scss';

interface DaoLinkLineProps {
  item: { account: string };
  index: number;
  onRemove: () => void;
}

export const DaoMemberLine: VFC<DaoLinkLineProps> = ({ index, onRemove }) => {
  const {
    register,
    watch,
    setValue: setFormValue,
    formState: { errors },
  } = useFormContext();
  const { accountId } = useAuthContext();

  const errorEl = useRef<HTMLDivElement>(null);

  const currentValue = watch(`accounts.${index}.account`);
  const error = get(errors, `accounts.${index}.account`);

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <DebouncedInput
              readOnly={currentValue === accountId}
              tabIndex={currentValue === accountId ? -1 : 0}
              inputClassName={cn({
                [styles.error]: !!error,
              })}
              className={cn({
                [styles.disabled]: currentValue === accountId,
              })}
              placeholder=""
              {...register(`accounts.${index}.account`)}
              defaultValue={currentValue}
              onValueChange={val => {
                setFormValue(`accounts.${index}.account`, val, {
                  shouldValidate: true,
                });
              }}
              size="block"
            />
          }
        />
        <IconButton
          disabled={currentValue === accountId}
          className={styles.deleteBtn}
          icon="buttonDelete"
          onClick={onRemove}
          size="medium"
        />
      </div>
      <div ref={errorEl} className={styles.errorEl} />
    </div>
  );
};
