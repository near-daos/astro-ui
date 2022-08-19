import { useTranslation } from 'next-i18next';
import useCountDown from 'react-countdown-hook';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { VFC, useState, useCallback } from 'react';
import { useForm, FormProvider, FieldError } from 'react-hook-form';

import { UserContacts } from 'services/NotificationsService/types';

import { NotificationsService } from 'services/NotificationsService';

import { Modal } from 'components/modal';
import { Input } from 'components/inputs/Input';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';
import { UsaOnly } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard/components/UsaOnly';

import { PkAndSignature } from 'context/WalletContext/types';
import { ContactForm } from './types';

import { useValidationSchema } from './useValidationSchema';

import { SendEmail } from './components/SendEmail';
import { SaveButton } from './components/SaveButton';

import styles from './AddUserInfoModal.module.scss';

export interface AddUserInfoModalProps {
  isOpen: boolean;
  isEdit: boolean;
  onClose: () => void;
  isEmail: boolean;
  accountId: string;
  setConfig: (config: UserContacts) => void;
  pkAndSignature: PkAndSignature | null;
}

const ONE_MINUTE_IN_MS = 60000;

export const AddUserInfoModal: VFC<AddUserInfoModalProps> = props => {
  const {
    isOpen,
    isEdit,
    onClose,
    isEmail,
    setConfig,
    accountId,
    pkAndSignature,
  } = props;

  const tBase = 'myAccountPage.popup';
  const { t } = useTranslation('common');

  const [codeValid, setCodeValid] = useState(true);
  const [timeLeft, { start }] = useCountDown(2 * ONE_MINUTE_IN_MS);

  const schema = useValidationSchema(isEmail, tBase);

  const methods = useForm<ContactForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const sendContact = useCallback(
    ({ contact }: ContactForm) => {
      start();

      NotificationsService.sendContact(
        accountId,
        contact,
        pkAndSignature,
        isEmail
      );
    },
    [start, accountId, isEmail, pkAndSignature]
  );

  const verifyContact = useCallback(
    async (code: string) => {
      setCodeValid(true);

      const successful = await NotificationsService.verifyContact(
        accountId,
        code,
        pkAndSignature,
        isEmail
      );

      if (successful) {
        const config = await NotificationsService.getUserContactConfig(
          accountId
        );

        setConfig(config);

        onClose();
      } else {
        setCodeValid(false);
      }
    },
    [onClose, isEmail, setConfig, accountId, pkAndSignature]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.header}>
        {t(
          `${tBase}.${isEmail ? 'email' : 'phone'}.${
            isEdit ? 'editTitle' : 'addTitle'
          }`
        )}
      </div>
      <div className={styles.message}>
        {t(`${tBase}.${isEmail ? 'email' : 'phone'}.message`)}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(sendContact)}>
          <InputFormWrapper
            errors={errors}
            className={styles.input}
            component={
              <Input
                label={
                  <div className={styles.label}>
                    {t(`${tBase}.${isEmail ? 'email' : 'phone'}.inputLabel`)}
                    {isEmail ? null : <UsaOnly className={styles.usaOnly} />}
                  </div>
                }
                size="auto"
                {...register('contact')}
                data-testid="contact-input"
              />
            }
          />

          <InputFormWrapper
            errors={
              codeValid
                ? {}
                : {
                    verificationCode: {
                      message: t(`${tBase}.codeIsIncorrect`),
                    } as unknown as FieldError,
                  }
            }
            className={styles.input}
            component={
              <Input
                label={
                  <div className={styles.label}>
                    {t(`${tBase}.${isEmail ? 'email' : 'phone'}.codeFrom`)}
                  </div>
                }
                size="auto"
                {...register('verificationCode')}
                rightContent={<SendEmail tBase={tBase} timeLeft={timeLeft} />}
                data-testid="verification-input"
              />
            }
          />

          <SaveButton tBase={tBase} onClick={verifyContact} />
        </form>
      </FormProvider>
    </Modal>
  );
};
