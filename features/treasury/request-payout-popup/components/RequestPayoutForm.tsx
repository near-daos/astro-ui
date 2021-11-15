import React from 'react';
import * as yup from 'yup';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from 'components/inputs/input/Input';
import { TextArea } from 'components/inputs/textarea/TextArea';
import { Button } from 'components/button/Button';
import { InputFormWrapper } from 'components/inputs/input-form-wrapper/InputFormWrapper';
import { TokenInput } from 'components/inputs/token-input';
import { BondInfo } from 'components/bond';
import { CreatePayoutInput } from 'features/treasury/request-payout-popup/types';

import { useDeviceType } from 'helpers/media';

import { SputnikService } from 'services/SputnikService';

import { Tokens } from 'context/CustomTokensContext';

import styles from './request-payout-form.module.scss';

const schema = yup.object().shape({
  tokenSymbol: yup.string().required(),
  amount: yup
    .number()
    .typeError('Must be a valid number.')
    .positive()
    .required()
    .min(0.00001, 'Minimal value is 0.00001.'),
  recipient: yup
    .string()
    .test(
      'notValidNearAccount',
      'Only valid near accounts are allowed',
      value => SputnikService.nearAccountExist(value || '')
    ),
  detail: yup.string().required(),
  externalUrl: yup.string()
});

export interface IRequestPayoutForm {
  tokenSymbol: string;
  amount: number;
  recipient: string;
  detail: string;
  externalUrl: string;
}

interface RequestPayoutFormProps {
  initialValues: CreatePayoutInput;
  onSubmit: (data: IRequestPayoutForm) => void;
  onCancel: () => void;
  tokens: Tokens;
  bond?: string;
}

export const RequestPayoutForm: React.FC<RequestPayoutFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  tokens,
  bond
}) => {
  const { isMobile } = useDeviceType();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, touchedFields }
  } = useForm<IRequestPayoutForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialValues,
      amount: 0
    }
  });

  const amount = register('amount');

  register('tokenSymbol');

  watch('amount');
  watch('tokenSymbol');

  function isFieldValid(name: keyof IRequestPayoutForm) {
    return touchedFields[name] && !errors[name]?.message;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root} noValidate>
      <InputFormWrapper
        errors={errors}
        className={styles.token}
        component={
          <TokenInput
            tokens={tokens}
            onTokenSelect={v =>
              setValue('tokenSymbol', v as string, {
                shouldDirty: true
              })
            }
            error={touchedFields.amount && !!errors.amount}
            success={touchedFields.amount && !errors.amount}
            name="amount"
            selectedToken={getValues().tokenSymbol}
            inputProps={amount}
            amount={getValues().amount}
          />
        }
      />
      <InputFormWrapper
        errors={errors}
        className={styles.recipient}
        component={
          <Input
            defaultValue={initialValues?.recipient}
            isValid={isFieldValid('recipient')}
            size="block"
            textAlign="left"
            {...register('recipient')}
            placeholder="NEAR account name"
            label="Send to"
            className={cn(styles.input)}
          />
        }
      />

      <InputFormWrapper
        errors={errors}
        className={styles.detail}
        component={
          <TextArea
            isValid={isFieldValid('detail')}
            size="block"
            defaultValue={initialValues?.payoutDetail}
            textAlign="left"
            resize="none"
            placeholder="Sample text"
            className={styles.textArea}
            maxLength={500}
            label="Details"
            {...register('detail')}
          />
        }
      />

      <Input
        size="block"
        defaultValue={initialValues?.externalUrl}
        isValid={isFieldValid('externalUrl')}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        placeholder="Add link"
        className={cn(styles.input, styles.url)}
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
