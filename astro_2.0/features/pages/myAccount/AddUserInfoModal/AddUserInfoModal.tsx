import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import React, { VFC, useState, useCallback } from 'react';

import { Modal } from 'components/modal';
import { Input } from 'components/inputs/Input';
import { Button } from 'components/button/Button';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';

import { CodeStatus } from './components/CodeStatus';

import styles from './AddUserInfoModal.module.scss';

interface AddUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEmail?: boolean;
}

export const AddUserInfoModal: VFC<AddUserInfoModalProps> = props => {
  const { isOpen, onClose, isEmail } = props;

  const tBase = 'myAccountPage.popup';
  const { t } = useTranslation('common');

  const [codeValid] = useState(false);

  function getValidationSchema() {
    const valBase = isEmail ? `${tBase}.email` : `${tBase}.phone`;

    const validation = isEmail
      ? yup
          .string()
          .required(t(`${valBase}.required`))
          .email(t(`${valBase}.error`))
      : yup
          .string()
          .required(t(`${valBase}.required`))
          .matches(
            /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
            t(`${valBase}.error`)
          );

    return yup.object().shape({
      contact: validation,
    });
  }

  const methods = useForm<{ contact: string }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(getValidationSchema()),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = useCallback(() => {
    // eslint-disable-next-line
    console.log('>>> submitting');
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={styles.header}>
        {t(`${tBase}.${isEmail ? 'email' : 'phone'}.title`)}
      </div>
      <div className={styles.message}>
        {t(`${tBase}.${isEmail ? 'email' : 'phone'}.message`)}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputFormWrapper
            errors={errors}
            className={styles.input}
            component={
              <Input
                label={
                  <div className={styles.label}>
                    {t(`${tBase}.${isEmail ? 'email' : 'phone'}.inputLabel`)}
                  </div>
                }
                size="auto"
                {...register('contact')}
              />
            }
          />

          <InputFormWrapper
            errors={errors}
            className={styles.input}
            component={
              <Input
                label={
                  <div className={styles.label}>
                    {t(`${tBase}.${isEmail ? 'email' : 'phone'}.codeFrom`)}
                  </div>
                }
                size="auto"
                rightContent={<CodeStatus valid={codeValid} />}
              />
            }
          />

          <Button capitalize type="submit" size="block">
            {t(`${tBase}.save`)}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};
