import React, { useCallback, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useStateMachine } from 'little-state-machine';
import * as yup from 'yup';

import { Input } from 'components/inputs/Input';
import { TextArea } from 'components/inputs/TextArea';
import { SubmitButton } from 'astro_2.0/features/CreateDao/components/SubmitButton';

import { VALID_WEBSITE_NAME_REGEXP } from 'constants/regexp';
import useQuery from 'hooks/useQuery';
import {
  handleValidate,
  updateAction,
} from 'astro_2.0/features/CreateDao/components/helpers';

import { InfoStep } from 'astro_2.0/features/CreateDao/types';

import { DaoNameInputSection } from './components/DaoNameInputSection';
import { DaoAddress } from './components/DaoAddress';

import styles from './DaoNameForm.module.scss';

export const DaoNameForm: VFC = () => {
  const { t } = useTranslation();
  const { updateQuery } = useQuery<{
    step: string;
  }>({ shallow: true });
  const { actions, state } = useStateMachine({ updateAction });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isValid },
  } = useForm<InfoStep>({
    defaultValues: state.info,
    mode: 'onChange',
    resolver: async data => {
      const schema = yup.object().shape({
        displayName: yup
          .string()
          .trim()
          .min(3, t('createDAO.daoIncorrectLengthError'))
          .matches(
            VALID_WEBSITE_NAME_REGEXP,
            t('createDAO.daoIncorrectCharactersError')
          )
          .required(),
        purpose: yup.string().max(500),
      });

      return handleValidate<InfoStep>(schema, data, valid =>
        actions.updateAction({ info: { ...data, isValid: valid } })
      );
    },
  });

  const displayName = watch('displayName');

  const handleAddressChange = useCallback(
    val => {
      setValue('address', val, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAddressError = useCallback(
    address => {
      setError('address', {
        type: 'manual',
        message: 'This DAO is already exists',
      });
      actions.updateAction({
        info: { ...state.info, address, isValid: false },
      });
    },
    [actions, setError, state.info]
  );

  const onSubmit = (data: InfoStep) => {
    actions.updateAction({ info: { ...data, isValid } });

    updateQuery('step', 'kyc');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <div className={styles.header}>
        <h2>{t('createDAO.daoNameForm.daoNameAndPurpose')}</h2>
      </div>
      <DaoNameInputSection
        errors={errors}
        className={styles.nameInput}
        label={t('createDAO.daoNameForm.daoName')}
        component={
          <Input
            placeholder={t('createDAO.daoNameForm.daoSampleName')}
            size="block"
            isBorderless
            {...register('displayName')}
          />
        }
      />
      <DaoNameInputSection
        errors={errors}
        className={styles.address}
        label={
          <div>
            DAO Address <span className={styles.warning}>(auto filled)</span>
          </div>
        }
        labelClassName={styles.addressLabel}
        component={
          <DaoAddress
            displayName={displayName}
            name="address"
            onChange={handleAddressChange}
            onError={handleAddressError}
          />
        }
      />
      <DaoNameInputSection
        errors={errors}
        className={styles.purpose}
        label={t('createDAO.daoNameForm.daoPurpose')}
        component={
          <TextArea
            className={styles.purposeInput}
            size="block"
            minRows={1}
            maxRows={5}
            placeholder={t('createDAO.daoNameForm.daoSampleText')}
            maxLength={500}
            isBorderless
            {...register('purpose')}
          />
        }
      />
      <SubmitButton disabled={!isValid} />
    </form>
  );
};
