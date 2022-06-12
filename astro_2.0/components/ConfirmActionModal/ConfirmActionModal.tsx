import React, { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';

import { Modal } from 'components/modal';
import { Button } from 'components/button/Button';
import { TgasInput } from 'astro_2.0/components/TgasInput';

import { getGasValidation } from 'astro_2.0/features/CreateProposal/helpers';

import { DEFAULT_VOTE_GAS } from 'services/sputnik/constants';

import styles from './ConfirmActionModal.module.scss';

export interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: (val?: string) => void;
  title: string;
  message: string;
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    gas: getGasValidation(t),
  });

  const methods = useForm<{ gas: number }>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      gas: DEFAULT_VOTE_GAS,
    },
    resolver: yupResolver(schema),
  });

  const { handleSubmit } = methods;

  const submitHandler = (data: { gas: number }) => {
    return onClose(data.gas.toString());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <FormProvider {...methods}>
        <div className={styles.root}>
          <div className={styles.title}>{title}</div>
          <div className={styles.message}>{message}</div>

          <form
            noValidate
            className={styles.content}
            onSubmit={handleSubmit(submitHandler)}
          >
            <TgasInput />
            <Button
              capitalize
              type="submit"
              data-testid="close-button"
              className={styles.confirmButton}
            >
              Confirm
            </Button>
          </form>
        </div>
      </FormProvider>
    </Modal>
  );
};
