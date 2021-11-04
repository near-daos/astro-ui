import * as yup from 'yup';
import React, { VFC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

import { validUrlRegexp, validWebsiteName } from 'utils/regexp';

import { DAOFormValues } from './components/types';

import { DaoNameForm } from './components/DaoNameForm';
import { DaoSubmitForm } from './components/DaoSubmitForm';
import { DaoLinksForm } from './components/DaoLinksForm';
import { DaoRulesForm } from './components/DaoRulesForm';
import { DaoFlagForm } from './components/DaoFlagForm';
import { DaoPreviewForm } from './components/DaoPreviewForm';

const schema = yup.object().shape({
  displayName: yup
    .string()
    .trim()
    .min(3, 'Incorrect DAO name - at least 3 characters expected.')
    .matches(
      validWebsiteName,
      'Incorrect DAO name - you can use letters and numbers only with hyphens and spaces in the middle.'
    )
    .required(),
  purpose: yup.string().max(500),
  websites: yup
    .array()
    .of(yup.string().matches(validUrlRegexp, 'Enter correct url!').required()),
  proposals: yup.string().required(),
  structure: yup.string().required(),
  voting: yup.string().required(),
});

export const CreateDao: VFC = () => {
  const methods = useForm<DAOFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      proposals: undefined,
      structure: undefined,
      voting: undefined,
      websites: [],
      address: undefined,
      purpose: undefined,
      displayName: undefined,
      flagCover: undefined,
      flagLogo: undefined,
    },
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <DaoNameForm />
      <DaoLinksForm />
      <DaoRulesForm />
      <DaoFlagForm />
      <DaoPreviewForm />
      <DaoSubmitForm />
    </FormProvider>
  );
};
