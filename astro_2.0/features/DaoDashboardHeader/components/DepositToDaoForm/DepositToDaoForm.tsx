import { FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import { DepositInput } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm/components/DepositInput';
import { DepositButton } from 'astro_2.0/features/DaoDashboardHeader/components/DepositToDaoForm/components/DepositButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuthContext } from 'context/AuthContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import styles from './DepositToDaoForm.module.scss';

const schema = yup.object().shape({
  depositAmount: yup
    .number()
    .typeError('Must be a valid number.')
    .positive()
    .required('Required')
    .test(
      'onlyFiveDecimal',
      'Only numbers with five optional decimal place please',
      value => /^\d*(?:\.\d{0,5})?$/.test(`${value}`)
    ),
});

interface DepositToDaoForm {
  daoId: string;
}

export const DepositToDaoForm: React.FC<DepositToDaoForm> = ({ daoId }) => {
  const methods = useForm<{ depositAmount: number }>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { nearService } = useAuthContext();

  const { handleSubmit, setValue } = methods;

  const submitHandler = async (data: { depositAmount: number }) => {
    try {
      await nearService?.sendMoney(daoId, data.depositAmount);
    } catch (e) {
      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        description: e.message,
        lifetime: 20000,
      });
    }

    setValue('depositAmount', 0);
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={handleSubmit(submitHandler)}
        className={styles.form}
      >
        <DepositInput />
        <DepositButton />
      </form>
    </FormProvider>
  );
};
