import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FoundationView } from 'pages/create-dao/steps/foundation';
import { SettingsView } from 'pages/create-dao/steps/settings';
import { DAOFormValues } from 'pages/create-dao/steps/types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styles from './page.module.scss';

const steps = {
  foundation: FoundationView,
  settings: SettingsView
};

type StepType = keyof typeof steps;

const stepKeys = Object.keys(steps);

const CreateDaoPage: NextPage<{ step: string }> = () => {
  const router = useRouter();

  const methods = useForm<DAOFormValues>({
    defaultValues: {
      proposals: undefined,
      structure: undefined,
      voting: undefined
    }
  });

  // router.events.on('routeChangeComplete', () => {
  //   window.scrollTo(0, 0);
  // });

  const { step } = router.query;

  if (step == null) return null;

  const CurrentStep = steps[step as StepType];

  return (
    <div className={styles.root}>
      <FormProvider {...methods}>
        <CurrentStep />
      </FormProvider>
      <pre>{JSON.stringify(methods.watch())}</pre>
    </div>
  );
};

CreateDaoPage.getInitialProps = async ({ query, res }) => {
  const firstStep = stepKeys[0];

  const { step } = query;

  if (res && step !== firstStep) {
    res.writeHead(301, { Location: `/create-dao/${firstStep}` });
    res.end();
  }

  return { step: step as string };
};

export default CreateDaoPage;
