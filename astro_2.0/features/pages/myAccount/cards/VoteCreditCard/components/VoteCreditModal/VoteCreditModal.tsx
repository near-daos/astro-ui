import React, { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Modal } from 'components/modal';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './VoteCreditModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  daoName: string;
  daoFunds: number;
}

export const VoteCreditModal: FC<Props> = ({
  isOpen,
  onClose,
  daoName,
  daoFunds,
}) => {
  const schema = yup.object().shape({
    credit: yup
      .number()
      .typeError('Must be a valid number.')
      .positive()
      .max(daoFunds, 'Must not exceed dao funds')
      .required('Required'),
  });

  const methods = useForm<{ credit: number }>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      credit: 0,
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit } = methods;

  const submitHandler = () => {
    // todo - update credit
    return onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <FormProvider {...methods}>
        <form
          noValidate
          className={styles.root}
          onSubmit={handleSubmit(submitHandler)}
        >
          <h2>Vote credit</h2>
          <p className={styles.desc}>
            Enter vote credit for <b>{daoName}</b> to vote without confirmation
            on NEAR Wallet
          </p>
          <div className={styles.input}>
            <InputWrapper fieldName="credit" label="Credit" fullWidth>
              <div>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  {...register('credit')}
                  size="medium"
                />
                <span className={styles.suffix}>NEAR</span>
              </div>
            </InputWrapper>
          </div>

          <div className={styles.footer}>
            <Button
              capitalize
              className={styles.confirmButton}
              variant="secondary"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button capitalize type="submit" className={styles.confirmButton}>
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
