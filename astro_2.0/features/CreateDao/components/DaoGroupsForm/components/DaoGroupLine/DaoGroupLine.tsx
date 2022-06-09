import React, { useRef, VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import get from 'lodash/get';

import { DebouncedInput } from 'components/inputs/Input';
import { IconButton } from 'components/button/IconButton';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import styles from './DaoGroupLine.module.scss';

interface DaoLinkLineProps {
  item: { group: string };
  index: number;
  canBeRemoved?: boolean;
  readOnly?: boolean;
  onRemove: () => void;
}

export const DaoGroupLine: VFC<DaoLinkLineProps> = ({
  index,
  onRemove,
  canBeRemoved = true,
  readOnly = false,
}) => {
  const {
    register,
    watch,
    setValue: setFormValue,
    formState: { errors },
  } = useFormContext();

  const errorEl = useRef<HTMLDivElement>(null);
  const currentValue = watch(`groups.${index}.group`);
  const error = get(errors, `groups.${index}.group`);

  return (
    <div className={styles.root}>
      <div className={styles.link}>
        <InputFormWrapper
          errors={errors}
          errorElRef={errorEl}
          className={styles.validationWrapper}
          component={
            <DebouncedInput
              inputClassName={cn({
                [styles.error]: !!error,
              })}
              readOnly={readOnly}
              placeholder="Group name"
              {...register(`groups.${index}.group`)}
              defaultValue={currentValue}
              onValueChange={val => {
                setFormValue(`groups.${index}.group`, val, {
                  shouldValidate: true,
                });
              }}
              size="block"
            />
          }
        />

        {canBeRemoved && (
          <IconButton
            className={styles.deleteBtn}
            icon="buttonDelete"
            onClick={onRemove}
            size="medium"
          />
        )}
      </div>
      <div ref={errorEl} className={styles.errorEl} />
    </div>
  );
};
