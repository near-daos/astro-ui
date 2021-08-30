import { NextPage } from 'next';
import { Router, useRouter } from 'next/router';
import { FlagView } from 'pages/create-dao/steps/flag';
import { FormView } from 'pages/create-dao/steps/form';
import { FoundationView } from 'pages/create-dao/steps/foundation';
import { ReviewView } from 'pages/create-dao/steps/review';
import { SettingsView } from 'pages/create-dao/steps/settings';
import { TransparencyView } from 'pages/create-dao/steps/transparency';
import { DAOFormValues } from 'pages/create-dao/steps/types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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

  const methods = useForm<DAOFormValues>({
    defaultValues: {
      proposals: undefined,
      structure: undefined,
      voting: undefined,
      websites: [],
      address: undefined,
      purpose: undefined,
      displayName: undefined,
      flag: undefined
    }
  });

  Router.events.on('routeChangeComplete', () => {
    window.scrollTo(0, 0);
  });

  const { step } = router.query;

  if (step == null) return null;

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
