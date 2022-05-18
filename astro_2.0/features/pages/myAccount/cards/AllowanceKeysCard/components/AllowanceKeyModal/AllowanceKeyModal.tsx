import React, { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Modal } from 'components/modal';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/components/AllowanceKeyModal/AllowanceKeyModal.module.scss';
import { useWalletContext } from 'context/WalletContext';
import { useRouter } from 'next/router';
import { GA_EVENTS, sendGAEvent } from 'utils/ga';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  daoName: string;
}

export const AllowanceKeyModal: FC<Props> = ({ isOpen, onClose, daoName }) => {
  const schema = yup.object().shape({
    allowance: yup
      .number()
      .typeError('Must be a valid number.')
      .positive()
      .max(1)
      .required('Required'),
  });

  const { nearService, accountId } = useWalletContext();
  const router = useRouter();

  const methods = useForm<{ allowance: number }>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      allowance: 0.1,
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit } = methods;

  const submitHandler = async (data: { allowance: number }) => {
    const allowance = data.allowance.toString();

    await nearService?.requestDaoAllowanceKey(daoName, allowance);

    sendGAEvent({
      name: GA_EVENTS.REQUEST_ALLOWANCE_KEY,
      accountId,
      daoId: daoName,
    });

    router.reload();

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
          <h2>Allowance amount</h2>
          <p className={styles.desc}>
            Approve up to 1 NEAR allowance for <b>{daoName}</b> to vote without
            confirmation on NEAR Wallet
          </p>
          <div className={styles.input}>
            <InputWrapper fieldName="credit" label="Allowance amount" fullWidth>
              <div>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  {...register('allowance')}
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
