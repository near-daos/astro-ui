import React, { FC } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { BondInfo } from 'components/bond';
import { Button } from 'components/button/Button';
import { Input } from 'components/inputs/input/Input';
import { Select } from 'components/inputs/select/Select';
import { TokenInput } from 'components/inputs/token-input';
import { TextArea } from 'components/inputs/textarea/TextArea';
import { DeadlineUnit } from 'components/cards/bounty-card/types';
import { InputFormWrapper } from 'components/inputs/input-form-wrapper/InputFormWrapper';

import { CreateBountyInput } from 'features/bounty/dialogs/create-bounty-dialog/types';
import { useDeviceType } from 'helpers/media';

import { Tokens } from 'context/CustomTokensContext';
import { schema, deadlineUnitOptions } from './helpers';

import styles from './create-bounty-form.module.scss';

interface CreateBountyFormProps {
  initialValues: CreateBountyInput;
  onSubmit: (data: CreateBountyInput) => void;
  onCancel: () => void;
  tokens: Tokens;
  bond?: string;
}

export const CreateBountyForm: FC<CreateBountyFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  tokens,
  bond
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<CreateBountyInput>({
    defaultValues: initialValues,
    resolver: yupResolver(schema)
  });
  const { isMobile } = useDeviceType();

  const amount = register('amount');

  register('token');

  const currentAmount = watch('amount');
  const currentToken = watch('token');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root} noValidate>
      <InputFormWrapper
        errors={errors}
        className={styles.token}
        component={
          <TokenInput
            tokens={tokens}
            onTokenSelect={v =>
              setValue('token', v as string, {
                shouldDirty: true
              })
            }
            error={touchedFields.amount && !!errors.amount}
            success={touchedFields.amount && !errors.amount}
            name="amount"
            selectedToken={currentToken}
            inputProps={amount}
            amount={currentAmount}
          />
        }
      />
      <InputFormWrapper
        errors={errors}
        className={styles.details}
        component={
          <TextArea
            isValid={touchedFields.details && !errors.details?.message}
            size="block"
            textAlign="left"
            resize="none"
            placeholder="Sample text"
            className={styles.textArea}
            maxLength={500}
            label="Details"
            {...register('details')}
          />
        }
      />
      <Input
        size="block"
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        className={cn(styles.input, styles.externalUrl)}
      />
      <InputFormWrapper
        errors={errors}
        className={styles.slot}
        component={
          <Input
            size="block"
            isValid={touchedFields.slots && !errors.slots?.message}
            textAlign="center"
            type="number"
            label="Number of bounty claims"
            {...register('slots')}
            className={styles.inlineInput}
          />
        }
      />
      <InputFormWrapper
        errors={errors}
        className={styles.deadline}
        component={
          <Input
            size="block"
            isValid={
              touchedFields.deadlineThreshold &&
              !errors.deadlineThreshold?.message
            }
            type="number"
            label="Complete in"
            textAlign="center"
            className={styles.inlineInput}
            {...register('deadlineThreshold')}
          />
        }
      />
      <InputFormWrapper
        errors={errors}
        className={styles.deadlineSelect}
        component={
          <Select
            defaultValue={initialValues?.deadlineUnit}
            className={styles.deadlineUnit}
            placeholder=""
            size="block"
            label="&nbsp;"
            options={deadlineUnitOptions}
            {...register('deadlineUnit')}
            onChange={v =>
              setValue('deadlineUnit', (v || 'day') as DeadlineUnit, {
                shouldDirty: true
              })
            }
          />
        }
      />
      <div className={styles.footer}>
        <BondInfo bond={bond} />
        <div className={styles.buttonsWrapper}>
          <Button
            variant="secondary"
            onClick={onCancel}
            size={isMobile ? 'block' : 'small'}
            className={styles.mr8}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            size={isMobile ? 'block' : 'small'}
            className={styles.ml8}
          >
            Propose
          </Button>
        </div>
      </div>
    </form>
  );
};
