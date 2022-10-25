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

import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import { useWalletContext } from 'context/WalletContext';

import { Intro } from './components/steps/Intro';

import styles from './CreateGovernanceTokenPageContent.module.scss';

interface CreateGovernanceTokenPageContentProps {
  daoContext: DaoContext;
}

export const CreateGovernanceTokenPageContent: VFC<
  CreateGovernanceTokenPageContentProps
> = props => {
  const { daoContext } = props;
  const { t } = useTranslation();
  const { status, update, loading } = useCreateGovernanceTokenStatus();
  const { accountId } = useWalletContext();
  const { daoVersion } = daoContext.dao;
  const isSupportedVersion = daoVersion?.version[0] > 2;
  const isInProgress = status && status.step !== null;
  const isViewProposal = status?.proposalId !== null;
  const isCouncil = isCouncilUser(daoContext.dao, accountId);
  const isPermitted =
    isCouncil &&
    daoContext.userPermissions.isCanCreateProposals &&
    daoContext.userPermissions.allowedProposalsToCreate[
      ProposalType.SetStakingContract
    ];
  // const isSupportedWallet = currentWallet !== WalletType.SELECTOR_NEAR;
  const showLowBalanceWarning =
    useLowBalanceWarning(daoContext.userPermissions, status?.step) &&
    !status?.wizardCompleted;

  function renderContent() {
    if (!isPermitted && !isViewProposal) {
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
        disabled={!isPermitted || showLowBalanceWarning || !isSupportedVersion}
      />
    );
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.header}>
        {isInProgress
          ? t('createGovernanceTokenPage.governanceTokenSetup')
          : t('createGovernanceTokenPage.tokenWeightedVoting')}
      </h1>
      {!isSupportedVersion && (
        <DaoWarning
          content={
            <>
              <div className={styles.title}>Warning</div>
              <div className={styles.text}>
                Token weighted voting is not supported in DAO 2.0
              </div>
            </>
          }
          className={styles.warningWrapper}
        />
      )}
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
