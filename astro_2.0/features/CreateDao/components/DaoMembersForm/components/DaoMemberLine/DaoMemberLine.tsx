import React, { FormEvent, useCallback, useRef, useState, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import { useDebounce } from 'react-use';

import { Input } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { useAuthContext } from 'context/AuthContext';
import { validateUserAccount } from 'astro_2.0/features/CreateProposal/helpers';

import styles from './DaoMemberLine.module.scss';

interface DaoLinkLineProps {
  index: number;
  removeLink: (index: number) => void;
}

export const DaoMemberLine: VFC<DaoLinkLineProps> = ({ index, removeLink }) => {
  const {
    register,
    watch,
    setValue: setFormValue,
    setError: setFormError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { accountId } = useAuthContext();

  const currentValue = watch(`accounts.${index}`);
  const [value, setValue] = useState(currentValue);

  const error = errors.accounts?.find(
    (item: { path: string }) => item?.path === `accounts[${index}]`
  );

  const errorEl = useRef<HTMLDivElement>(null);

  const removeWebsiteLink = useCallback(() => {
    removeLink(index);
  }, [index, removeLink]);

  const preparedErrors = error
    ? {
        [`accounts.${index}`]: error,
      }
    : {};

  useDebounce(
    async () => {
      const fieldName = `accounts.${index}`;

      if (!value || !value.trim()) {
        return;
      }

      const isAccountExist = await validateUserAccount(value);

      if (!isAccountExist) {
        setFormError(fieldName, {
          type: 'validateUserAccount',
          message: 'This account does not exist',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          path: `accounts[${index}]`,
        });
      } else {
        clearErrors(fieldName);
        setFormValue(fieldName, value, { shouldValidate: true });
      }
    },
    500,
    [value]
  );

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <InputFormWrapper
          errors={preparedErrors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <Input
              readOnly={currentValue === accountId}
              tabIndex={currentValue === accountId ? -1 : 0}
              inputClassName={cn({
                [styles.error]: !!error,
              })}
              className={cn({
                [styles.disabled]: currentValue === accountId,
              })}
              key={`accounts.${index}` as const}
              placeholder=""
              {...register(`accounts.${index}` as const, {
                shouldUnregister: true,
              })}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                setValue((e.target as HTMLInputElement).value);
              }}
              size="block"
            />
          }
        />
        <IconButton
          disabled={currentValue === accountId}
          className={styles.deleteBtn}
          icon="buttonDelete"
          onClick={removeWebsiteLink}
          size="medium"
        />
      </div>
      <div ref={errorEl} className={styles.errorEl} />
    </div>
  );
};
