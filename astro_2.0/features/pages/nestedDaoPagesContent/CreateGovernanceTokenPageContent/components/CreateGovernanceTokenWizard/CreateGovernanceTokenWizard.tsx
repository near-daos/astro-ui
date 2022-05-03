import React, { FC, useCallback, useEffect, useState } from 'react';

import { CreationProgress } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/CreateToken/components/CreationProgress';
import { WarningPanel } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/WarningPanel';
import { SelectToken } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/SelectToken';

import {
  getCreateGovernanceTokenStepProposalVariant,
  getCreateGovernanceTokenSteps,
  getNextCreateGovernanceTokenWizardStep,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/helpers';
import { ViewStepProposal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/components/UpgradeVersionWizard/components/ViewStepProposal';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { ChooseExistingToken } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/ChooseExistingToken/ChooseExistingToken';

import { ProposalFeedItem, ProposalType } from 'types/proposal';
import { DaoContext } from 'types/context';
import { CreateGovernanceTokenSteps, ProgressStatus } from 'types/settings';

import { SputnikHttpService } from 'services/sputnik';

import { useWalletContext } from 'context/WalletContext';
import styles from './CreateGovernanceTokenWizard.module.scss';

interface Props {
  daoContext: DaoContext;
  onUpdate: ({
    step,
    proposalId,
  }: {
    step: CreateGovernanceTokenSteps | null;
    proposalId: number | null;
  }) => Promise<void>;
  status: ProgressStatus;
}

export const CreateGovernanceTokenWizard: FC<Props> = ({
  daoContext,
  onUpdate,
  status,
}) => {
  const { accountId } = useWalletContext();
  const [proposal, setProposal] = useState<ProposalFeedItem | null>(null);
  const steps = getCreateGovernanceTokenSteps(status, proposal);
  const stepProposalVariant = getCreateGovernanceTokenStepProposalVariant(
    status
  );
  const proposalId = status?.proposalId;
  const isViewProposal = proposalId !== null;
  const canControl =
    daoContext.userPermissions.isCanCreateProposals &&
    daoContext.userPermissions.allowedProposalsToCreate[
      ProposalType.UpgradeSelf
    ];

  const handleProposalCreate = useCallback(
    async (newProposalId: number | null) => {
      if (newProposalId !== null && newProposalId !== undefined && canControl) {
        await onUpdate({
          ...status,
          step: status.step,
          proposalId: Number(newProposalId),
        });
      }
    },
    [canControl, onUpdate, status]
  );

  const handleViewProposalApprove = useCallback(async () => {
    if (!canControl) {
      return;
    }

    await onUpdate({
      ...status,
      step: getNextCreateGovernanceTokenWizardStep(status.step),
      proposalId: null,
    });
  }, [canControl, onUpdate, status]);

  const handleViewProposalReject = useCallback(async () => {
    if (!canControl) {
      return;
    }

    await onUpdate({
      ...status,
      step: null,
      proposalId: null,
    });
  }, [canControl, onUpdate, status]);

  useEffect(() => {
    (async () => {
      if (proposalId !== undefined && proposalId !== null) {
        const res = await SputnikHttpService.getProposalById(
          `${daoContext.dao.id}-${proposalId}`,
          accountId
        );

        setProposal(res);
      } else {
        setProposal(null);
      }
    })();
  }, [accountId, daoContext.dao.id, proposalId]);

  if (status.step === CreateGovernanceTokenSteps.ChooseFlow) {
    return <SelectToken onUpdate={onUpdate} />;
  }

  function renderContent() {
    if (!steps) {
      return null;
    }

    if (stepProposalVariant === null) {
      return <ChooseExistingToken onUpdate={onUpdate} status={status} />;
    }

    if (isViewProposal && proposal) {
      return (
        <ViewStepProposal
          isLastStep={
            status.step === CreateGovernanceTokenSteps.ChangeDaoPolicy
          }
          canControlUpgrade={canControl}
          proposal={proposal}
          onApproved={handleViewProposalApprove}
          onRejected={handleViewProposalReject}
        />
      );
    }

    if (!isViewProposal) {
      return (
        <CreateProposal
          {...daoContext}
          onCreate={handleProposalCreate}
          redirectAfterCreation={false}
          onClose={() => null}
          daoTokens={{}}
          showFlag={false}
          showClose={false}
          showInfo={false}
          canCreateTokenProposal={canControl}
          proposalVariant={stepProposalVariant}
        />
      );
    }

    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.steps}>
        <CreationProgress steps={steps} className={styles.progress} />
        <WarningPanel className={styles.warning} />
      </div>
      <div className={styles.content}>
        {/* <button onClick={handleViewProposalReject}>reset</button> */}
        {renderContent()}
      </div>
    </div>
  );
};
