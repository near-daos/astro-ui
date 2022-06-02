import React, { VFC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import useQuery from 'hooks/useQuery';
import { useStateMachine } from 'little-state-machine';
import * as yup from 'yup';

import { Input } from 'components/inputs/Input';
import { InputFormWrapper } from 'components/inputs/InputFormWrapper';
import {
  handleValidate,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';
import { StepCounter } from 'astro_2.0/features/CreateDao/components/StepCounter';

import { LegalStep } from 'astro_2.0/features/CreateDao/types';

import { VALID_URL_REGEXP } from 'constants/regexp';

import styles from './DaoLegalStatus.module.scss';

export const DaoLegalStatus: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const methods = useForm<LegalStep>({
    defaultValues: state.kyc,
    mode: 'all',
    resolver: async data => {
      const schema = yup.object().shape({
        legalStatus: yup.string().max(50),
        legalLink: yup.string().matches(VALID_URL_REGEXP, {
          message: t('createDAO.daoIncorrectURLError'),
          excludeEmptyString: true,
        }),
      });

      return handleValidate<LegalStep>(schema, data, valid =>
        actions.updateAction({ kyc: { ...data, isValid: valid } })
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = (data: LegalStep) => {
    actions.updateAction({ kyc: { ...data, isValid } });

    updateQuery('step', 'links');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <div className={styles.header}>
          <h2>
            {t('createDAO.daoLegalStatus.daoKYC')}{' '}
            <span className={styles.optional}>({t('createDAO.optional')})</span>
          </h2>
          <StepCounter total={8} current={2} />
        </div>
        <p className={styles.description}>
          {t('createDAO.daoLegalStatus.daoKYCDescription')}
        </p>
        <InputFormWrapper
          errors={errors}
          component={
            <Input
              size="block"
              className={styles.inputWrapper}
              inputClassName={styles.inputEl}
              placeholder={t(
                'createDAO.daoLegalStatus.daoKYCDescriptionPlaceholder'
              )}
              {...register('legalStatus')}
            />
          }
        />

        <p className={styles.description}>
          {t('createDAO.daoLegalStatus.daoKYCLink')}
        </p>
        <InputFormWrapper
          errors={errors}
          component={
            <Input
              size="block"
              className={styles.inputWrapper}
              inputClassName={styles.inputEl}
              placeholder={t('createDAO.daoLegalStatus.daoKYCLinkPlaceholder')}
              {...register('legalLink')}
            />
          }
        />
        <SubmitButton disabled={!isValid} />
      </form>
    </FormProvider>
  );
};
