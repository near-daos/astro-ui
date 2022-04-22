import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { DaoContext } from 'types/context';
import { ProposalType } from 'types/proposal';

import { Loader } from 'components/loader';
import { CreateGovernanceTokenWizard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/CreateGovernanceTokenWizard/CreateGovernanceTokenWizard';

import { useCreateGovernanceTokenStatus } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/hooks';

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

  function renderContent() {
    if (!daoContext.userPermissions.isCanCreateProposals && !isViewProposal) {
      return <div>no permissions</div>;
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

    return <Intro onUpdate={update} disabled={!isPermitted} />;
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
