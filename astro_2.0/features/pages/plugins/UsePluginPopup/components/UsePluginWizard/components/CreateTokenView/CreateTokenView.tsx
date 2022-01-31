import React, { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  getNearFunctionDetails,
  useWizardContext,
} from 'astro_2.0/features/pages/plugins/UsePluginPopup/components/UsePluginWizard/helpers';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';

import styles from './CreateTokenView.module.scss';

const schema = yup.object().shape({
  tokenName: yup.string().required(),
  amountToMint: yup.number().integer().positive().required(),
  recipient: yup.string().required(),
});

interface IForm {
  tokenName: string;
  amountToMint: string;
  recipient: string;
}

export const CreateTokenView: FC = () => {
  const { data, setData, onClose } = useWizardContext();
  const nearFunction = data?.nearFunction;
  const { contract, method } = getNearFunctionDetails(nearFunction);

  const {
    register,
    handleSubmit,
    formState: { touchedFields, errors },
  } = useForm<IForm>({
    defaultValues: data,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IForm> = d => {
    setData(d);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.info}>
        <div>
          <div className={styles.label}>Contract</div>
          <div className={styles.value}>{contract}</div>
        </div>
        <div>
          <div className={styles.label}>Method</div>
          <div>{method}</div>
        </div>
      </div>
      <div className={styles.token}>
        <Input
          isValid={touchedFields.tokenName && !errors.tokenName?.message}
          size="block"
          textAlign="left"
          {...register('tokenName')}
          label="Token name"
        />
      </div>
      <div className={styles.amount}>
        <Input
          isValid={touchedFields.amountToMint && !errors.amountToMint?.message}
          size="block"
          textAlign="left"
          type="number"
          {...register('amountToMint')}
          label="Amount to mint"
        />
      </div>
      <div className={styles.recipient}>
        <Input
          isValid={touchedFields.recipient && !errors.recipient?.message}
          size="block"
          textAlign="left"
          {...register('recipient')}
          label="Recipient"
        />
      </div>
      <div className={styles.vote} />
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onClose}
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
