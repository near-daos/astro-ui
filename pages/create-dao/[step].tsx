import { NextPage } from 'next';
import isEmpty from 'lodash/isEmpty';
import { Router, useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CREATE_DAO_URL } from 'constants/routing';

import { FlagView } from 'features/create-dao/components/steps/flag';
import { FormView } from 'features/create-dao/components/steps/form';
import { FoundationView } from 'features/create-dao/components/steps/foundation';
import { ReviewView } from 'features/create-dao/components/steps/review';
import { SettingsView } from 'features/create-dao/components/steps/settings';
import { TransparencyView } from 'features/create-dao/components/steps/transparency';
import { DAOFormValues } from 'features/create-dao/components/steps/types';

import styles from './page.module.scss';

const steps = {
  foundation: FoundationView,
  settings: SettingsView,
  transparency: TransparencyView,
  form: FormView,
  flag: FlagView,
  review: ReviewView
};

type StepType = keyof typeof steps;

const CreateDaoPage: NextPage<{ step: string }> = () => {
  const router = useRouter();
  const { step } = router.query;

  const methods = useForm<DAOFormValues>({
    defaultValues: {
      proposals: undefined,
      structure: undefined,
      voting: undefined,
      websites: [],
      address: undefined,
      purpose: undefined,
      displayName: undefined,
      flag: undefined,
      flagPreview: undefined
    }
  });

  const isPageReloaded = useCallback(() => {
    return step !== 'foundation' && isEmpty(methods.getValues('structure'));
  }, [step, methods]);

  useEffect(() => {
    if (isPageReloaded()) {
      router.push(CREATE_DAO_URL);
    }
  }, [router, isPageReloaded]);

  Router.events.on('routeChangeComplete', () => {
    window.scrollTo(0, 0);
  });

  if (step === null || isPageReloaded()) {
    return null;
  }

  const CurrentStep = steps[step as StepType];

  return (
    <div className={styles.root}>
      <FormProvider {...methods}>
        <CurrentStep />
      </FormProvider>
    </div>
  );
};

export default CreateDaoPage;
