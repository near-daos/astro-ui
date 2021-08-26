import React, { FC } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';
import { TextArea } from 'components/textarea/TextArea';
import { Select } from 'components/select/Select';

import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import {
  CreateBountyInput,
  Token
} from 'features/bounty/dialogs/create-bounty-dialog/types';
import { DeadlineUnit } from 'components/cards/bounty-card/types';

import { VoteDetails } from 'components/vote-details';
import { schema, tokenOptions, deadlineUnitOptions } from './helpers';

import styles from './create-bounty-form.module.scss';

interface CreateBountyFormProps {
  initialValues: CreateBountyInput;
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
      <Select
        defaultValue={initialValues?.token}
        className={cn(styles.token)}
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
        className={cn(styles.input, styles.amount)}
      />
      <div className={styles.group}>
        <TextArea
          size="block"
          textAlign="left"
          resize="none"
          placeholder="Sample text"
          className={cn(styles['text-area'])}
          label="Group"
          {...register('group')}
        />
      </div>
      <Input
        size="block"
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        className={cn(styles.input, styles.externalUrl)}
      />
      <div className={styles.slot}>
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
      <div className={styles.deadline}>
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
      <div className={styles.vote}>
        <ExpandableDetails label="Vote details">
          <VoteDetails {...initialValues} />
        </ExpandableDetails>
      </div>
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
