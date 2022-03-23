import React, { useCallback, useRef, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';

import { Input } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { useAuthContext } from 'context/AuthContext';

import styles from './DaoMemberLine.module.scss';

interface DaoLinkLineProps {
  index: number;
  removeLink: (index: number) => void;
}

export const DaoMemberLine: VFC<DaoLinkLineProps> = ({ index, removeLink }) => {
  const {
    register,
    watch,
    formState: { errors, touchedFields },
  } = useFormContext();
  const { accountId } = useAuthContext();

  const currentValue = watch(`accounts.${index}`);

  const errorEl = useRef<HTMLDivElement>(null);

  const removeWebsiteLink = useCallback(() => {
    removeLink(index);
  }, [index, removeLink]);

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <Input
              tabIndex={currentValue === accountId ? -1 : 0}
              isValid={
                touchedFields.accounts?.[index] &&
                !errors.accounts?.[index]?.message
              }
              className={cn({
                [styles.disabled]: currentValue === accountId,
              })}
              key={`accounts.${index}` as const}
              placeholder=""
              {...register(`accounts.${index}` as const, {
                shouldUnregister: true,
              })}
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
