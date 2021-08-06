import React, { FC } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/textarea/TextArea';
import { Select } from 'components/select/Select';

import {
  CreateBountyInput,
  Token
} from 'components/bounty/create-bounty-dialog/types';
import { DeadlineUnit } from 'components/cards/bounty-card/types';

import {
  schema,
  tokenOptions,
  deadlineUnitOptions
} from 'components/bounty/create-bounty-dialog/components/create-bounty-form/helpers';

import styles from './create-bounty-form.module.scss';

interface CreateBountyFormProps {
  initialValues?: CreateBountyInput;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreateBountyForm: FC<CreateBountyFormProps> = ({
  initialValues,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields }
  } = useForm<CreateBountyInput>({
    defaultValues: initialValues,
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.row}>
        <Select
          defaultValue={initialValues?.token}
          className={cn(styles.mr8)}
          placeholder=""
          size="block"
          label="Token"
          options={tokenOptions}
          {...register('token')}
          onChange={v =>
            setValue('token', (v || 'NEAR') as Token, {
              shouldDirty: true
            })
          }
        />
        <Input
          isValid={touchedFields.amount && !errors.amount?.message}
          size="block"
          textAlign="left"
          type="number"
          {...register('amount')}
          label="Amount"
          className={cn(styles.input, styles.ml8)}
        />
      </div>
      <div className={styles.row}>
        <TextArea
          size="block"
          textAlign="left"
          resize="none"
          placeholder="Sample text"
          className={styles['text-area']}
          label="Group"
          {...register('group')}
        />
      </div>
      <div className={styles.row}>
        <Input
          size="block"
          isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
          textAlign="left"
          {...register('externalUrl')}
          label="External URL"
          className={cn(styles.input)}
        />
      </div>
      <div className={styles.row}>
        Bounty can be claimed up to
        <Input
          size="small"
          isValid={touchedFields.slots && !errors.slots?.message}
          textAlign="center"
          type="number"
          {...register('slots')}
          className={styles['inline-input']}
        />
        times.
      </div>
      <div className={styles.row}>
        Once claimed, bounty must be completed in
        <Input
          size="small"
          isValid={
            touchedFields.deadlineThreshold &&
            !errors.deadlineThreshold?.message
          }
          type="number"
          textAlign="center"
          className={styles['inline-input']}
          {...register('deadlineThreshold')}
        />
        <Select
          defaultValue={initialValues?.deadlineUnit}
          className={styles['deadline-unit']}
          placeholder=""
          size="content"
          options={deadlineUnitOptions}
          {...register('deadlineUnit')}
          onChange={v =>
            setValue('deadlineUnit', (v || 'day') as DeadlineUnit, {
              shouldDirty: true
            })
          }
        />
      </div>
      <div className={styles.row}>Vote details</div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onCancel}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          size="small"
          className={styles.ml8}
        >
          Propose
        </Button>
      </div>
    </form>
  );
};
