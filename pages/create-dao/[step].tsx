import { NextPage } from 'next';
import { Router, useRouter } from 'next/router';
import { FlagView } from 'features/create-dao/components/steps/flag';
import { FormView } from 'features/create-dao/components/steps/form';
import { FoundationView } from 'features/create-dao/components/steps/foundation';
import { ReviewView } from 'features/create-dao/components/steps/review';
import { SettingsView } from 'features/create-dao/components/steps/settings';
import { TransparencyView } from 'features/create-dao/components/steps/transparency';
import { DAOFormValues } from 'features/create-dao/components/steps/types';
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
