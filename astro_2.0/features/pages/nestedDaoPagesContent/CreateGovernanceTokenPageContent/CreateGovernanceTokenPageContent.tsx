import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';
import { ProposalType } from 'types/proposal';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Loader } from 'components/loader';
import { CreateGovernanceTokenWizard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/CreateGovernanceTokenWizard/CreateGovernanceTokenWizard';
import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import {
  useCreateGovernanceTokenStatus,
  useLowBalanceWarning,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/hooks';

import { Intro } from './components/steps/Intro';

import styles from './CreateGovernanceTokenPageContent.module.scss';

interface CreateGovernanceTokenPageContentProps {
  daoContext: DaoContext;
}

export const CreateGovernanceTokenPageContent: VFC<CreateGovernanceTokenPageContentProps> = props => {
  const { daoContext } = props;
  const { t } = useTranslation();
  const { status, update, loading } = useCreateGovernanceTokenStatus(
    daoContext.dao.id
  );
  const isInProgress = status && status.step !== null;
  const isViewProposal = status?.proposalId !== null;
  const isPermitted =
    daoContext.userPermissions.isCanCreateProposals &&
    daoContext.userPermissions.allowedProposalsToCreate[
      ProposalType.SetStakingContract
    ];
  const showLowBalanceWarning =
    useLowBalanceWarning(daoContext.userPermissions, status?.step) &&
    !status?.wizardCompleted;

  function renderContent() {
    if (!daoContext.userPermissions.isCanCreateProposals && !isViewProposal) {
      return <NoResultsView title="You don't have permissions to proceed" />;
    }

    if (loading) {
      return <Loader />;
    }

    if (isInProgress && status) {
      return (
        <CreateGovernanceTokenWizard
          daoContext={daoContext}
          onUpdate={update}
          status={status}
        />
      );
    }

    return (
      <Intro
        onUpdate={update}
        disabled={!isPermitted || showLowBalanceWarning}
      />
    );
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>
        {t('createGovernanceTokenPage.createGovernanceToken')}
      </h1>
      {showLowBalanceWarning && (
        <DaoWarning
          content={
            <>
              <div className={styles.title}>Warning</div>
              <div className={styles.text}>
                DAO available balance is too low. Send 6 NEAR to{' '}
                <b>{daoContext.dao.id}</b> and reload this page to proceed.
              </div>
            </>
          }
          className={styles.warningWrapper}
        />
      )}
      {renderContent()}
    </div>
  );
};
