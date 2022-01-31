import React, { VFC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';

import { STEPS } from './constants';

import { Intro } from './components/steps/Intro';
import { SelectToken } from './components/steps/SelectToken';

import styles from './CreateGovernanceTokenPageContent.module.scss';

interface CreateGovernanceTokenPageContentProps {
  daoContext: DaoContext;
}

export const CreateGovernanceTokenPageContent: VFC<CreateGovernanceTokenPageContentProps> = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { step } = router.query;

  function renderContent() {
    switch (step) {
      case STEPS.INTRO:
        return <Intro />;
      case STEPS.SELECT_TOKEN:
        return <SelectToken />;
      default:
        return <Intro />;
    }
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>
        {t('createGovernanceTokenPage.createGovernanceToken')}
      </h1>
      {renderContent()}
    </div>
  );
};
