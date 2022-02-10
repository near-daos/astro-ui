import * as yup from 'yup';
import React, { VFC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import { VALID_URL_REGEXP, VALID_WEBSITE_NAME_REGEXP } from 'constants/regexp';
import { DEFAULT_CREATE_DAO_GAS } from 'services/sputnik/constants';

import { validateImgSize, getImgValidationError } from 'utils/imageValidators';
import { gasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { validateDaoAddress } from 'astro_2.0/features/CreateDao/helpers';

import { DAOFormValues } from './components/types';

import { DaoNameForm } from './components/DaoNameForm';
import { DaoSubmitForm } from './components/DaoSubmitForm';
import { DaoLinksForm } from './components/DaoLinksForm';
import { DaoRulesForm } from './components/DaoRulesForm';
import { DaoFlagForm } from './components/DaoFlagForm';
import { DaoPreviewForm } from './components/DaoPreviewForm';
import { DaoLegalStatus } from './components/DaoLegalStatus';

interface CreateDaoProps {
  defaultFlag: string;
}

export const CreateDao: VFC<CreateDaoProps> = ({ defaultFlag }) => {
  const { t } = useTranslation();
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
    address: yup
      .string()
      .test('exists', t('createDAO.daoAlreadyExist'), validateDaoAddress),
    purpose: yup.string().max(500),
    websites: yup
      .array()
      .of(
        yup
          .string()
          .matches(VALID_URL_REGEXP, t('createDAO.daoIncorrectURLError'))
          .required()
      ),
    proposals: yup.string().required(),
    structure: yup.string().required(),
    voting: yup.string().required(),
    flagCover: yup
      .mixed()
      .test('fileSize', getImgValidationError, validateImgSize),
    flagLogo: yup
      .mixed()
      .test('fileSize', getImgValidationError, validateImgSize),
    legalStatus: yup.string().max(50),
    legalLink: yup.string().matches(VALID_URL_REGEXP, {
      message: t('createDAO.daoIncorrectURLError'),
      excludeEmptyString: true,
    }),
    gas: gasValidation,
  });

  const methods = useForm<DAOFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      defaultFlag,
      proposals: undefined,
      structure: undefined,
      voting: undefined,
      websites: [],
      address: undefined,
      purpose: undefined,
      displayName: undefined,
      flagCover: undefined,
      flagLogo: undefined,
      legalStatus: undefined,
      legalLink: undefined,
      gas: DEFAULT_CREATE_DAO_GAS,
    },
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <DaoNameForm />
      <DaoLegalStatus />
      <DaoLinksForm />
      <DaoRulesForm />
      <DaoFlagForm />
      <DaoPreviewForm />
      <DaoSubmitForm />
    </FormProvider>
  );
};
