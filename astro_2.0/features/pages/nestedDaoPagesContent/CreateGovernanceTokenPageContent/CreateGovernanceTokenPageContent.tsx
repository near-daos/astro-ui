import React, { VFC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';

import { STEPS } from './constants';

import { Intro } from './components/steps/Intro';
import { SelectToken } from './components/steps/SelectToken';
import { CreateToken } from './components/steps/CreateToken';
import { TokenDistribution } from './components/steps/TokenDistribution';

import styles from './CreateGovernanceTokenPageContent.module.scss';

interface CreateGovernanceTokenPageContentProps {
  daoContext: DaoContext;
}

export const CreateGovernanceTokenPageContent: VFC<CreateGovernanceTokenPageContentProps> = props => {
  const { daoContext } = props;

  const router = useRouter();
  const { t } = useTranslation();

  const { step } = router.query;

  function renderContent() {
    switch (step) {
      case STEPS.INTRO:
        return <Intro />;
      case STEPS.SELECT_TOKEN:
        return <SelectToken />;
      case STEPS.CREATE_TOKEN:
        return <CreateToken daoContext={daoContext} />;
      case STEPS.TOKEN_DISTRIBUTION:
        return <TokenDistribution daoContext={daoContext} />;
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
