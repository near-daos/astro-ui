import * as yup from 'yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import { Input } from 'components/input/Input';
import { Select } from 'components/select/Select';
import { TextArea } from 'components/textarea/TextArea';
import { Button } from 'components/button/Button';
import { VoteDetails } from 'components/vote-details';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { tokenOptions } from 'features/bounty/dialogs/create-bounty-dialog/components/create-bounty-form/helpers';
import { CreatePayoutInput } from 'features/treasury/request-payout-popup/types';
import { Token } from 'features/types';

import { useDeviceType } from 'helpers/media';

import styles from './request-payout-form.module.scss';

const schema = yup.object().shape({
  token: yup.string().required(),
  amount: yup
    .number()
    .positive()
    .required()
    .test(
      'onlyOneDecimal',
      'Only numbers with one optional decimal place please',
      value => /^\d*(?:\.\d)?$/.test(`${value}`)
    ),
  recipient: yup.string().required(),
  detail: yup.string().required(),
  externalUrl: yup.string()
});

export interface IRequestPayoutForm {
  token: Token;
  tokenAddress?: string;
  amount: number;
  recipient: string;
  detail: string;
  externalUrl: string;
}

interface RequestPayoutFormProps {
  initialValues: CreatePayoutInput;
  onSubmit: (data: IRequestPayoutForm) => void;
  onCancel: () => void;
}

export const RequestPayoutForm: React.FC<RequestPayoutFormProps> = ({
  initialValues,
  onSubmit,
  onCancel
}) => {
  const { isMobile } = useDeviceType();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<IRequestPayoutForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialValues,
      amount: 0
    }
  });

  const selectedToken = watch('token');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root} noValidate>
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
      {selectedToken === ('Fungible Token' as Token) && (
        <Input
          size="block"
          isValid={touchedFields.tokenAddress && !errors.tokenAddress?.message}
          textAlign="left"
          {...register('tokenAddress')}
          label="Token address"
          className={cn(styles.input, styles.tokenAddress)}
        />
      )}
      <Input
        isValid={touchedFields.amount && !errors.amount?.message}
        defaultValue={initialValues?.amount}
        size="block"
        textAlign="left"
        type="number"
        lang="en-US"
        step="0.1"
        min="0.1"
        {...register('amount')}
        label="Amount"
        className={cn(styles.input, styles.amount)}
      />
      <div className={styles.recipient}>
        <Input
          defaultValue={initialValues?.recipient}
          isValid={touchedFields.recipient && !errors.recipient?.message}
          size="block"
          textAlign="left"
          {...register('recipient')}
          placeholder="NEAR account name"
          label="Send to"
          className={cn(styles.input)}
        />
      </div>
      <div className={styles.detail}>
        <TextArea
          isValid={touchedFields.detail && !errors.detail?.message}
          size="block"
          defaultValue={initialValues?.payoutDetail}
          textAlign="left"
          resize="none"
          placeholder="Sample text"
          className={styles.textArea}
          label="detail"
          {...register('detail')}
        />
      </div>
      <Input
        size="block"
        defaultValue={initialValues?.externalUrl}
        isValid={touchedFields.externalUrl && !errors.externalUrl?.message}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        placeholder="Add link"
        className={cn(styles.input, styles.url)}
      />
      <div className={styles.vote}>
        <ExpandableDetails label="Vote details" className={styles.voteDetails}>
          <VoteDetails scope="transfer" />
        </ExpandableDetails>
      </div>
      <div className={styles.footer}>
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
    </form>
  );
};
