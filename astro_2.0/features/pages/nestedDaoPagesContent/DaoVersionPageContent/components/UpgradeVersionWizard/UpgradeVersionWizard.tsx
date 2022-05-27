import React, { FC, useCallback, useEffect, useState } from 'react';

import { CreationProgress } from 'astro_2.0/components/CreationProgress';
import { CreateProposal } from 'astro_2.0/features/CreateProposal';
import { ViewStepProposal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/components/UpgradeVersionWizard/components/ViewStepProposal';

import { DaoContext } from 'types/context';
import { UpgradeStatus, UpgradeSteps } from 'types/settings';
import { ProposalFeedItem, ProposalType } from 'types/proposal';

import { SputnikHttpService } from 'services/sputnik';

import {
  getNextUpgradeStep,
  getStepProposalVariant,
  getVersionUpgradeSteps,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoVersionPageContent/components/UpgradeVersionWizard/helpers';

import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { useWalletContext } from 'context/WalletContext';
import styles from './UpgradeVersionWizard.module.scss';

interface Props {
  daoContext: DaoContext;
  upgradeStatus: UpgradeStatus;
  versionHash: string;
  onUpdate: ({
    upgradeStep,
    proposalId,
    versionHash,
  }: {
    upgradeStep: UpgradeSteps | null;
    proposalId: number | null;
    versionHash: string;
  }) => Promise<void>;
}

export const UpgradeVersionWizard: FC<Props> = ({
  daoContext,
  upgradeStatus,
  onUpdate,
  versionHash,
}) => {
  const { accountId } = useWalletContext();
  const [proposal, setProposal] = useState<ProposalFeedItem | null>(null);
  const steps = getVersionUpgradeSteps(upgradeStatus, proposal);
  const stepProposalVariant = getStepProposalVariant(upgradeStatus);
  const proposalId = upgradeStatus?.proposalId;
  const isViewProposal = proposalId !== null;
  const canControlUpgrade =
    daoContext.userPermissions.isCanCreateProposals &&
    daoContext.userPermissions.allowedProposalsToCreate[
      ProposalType.UpgradeSelf
    ];

  const handleProposalCreate = useCallback(
    async (newProposalId: number | number[] | null) => {
      if (
        newProposalId !== null &&
        newProposalId !== undefined &&
        canControlUpgrade
      ) {
        await onUpdate({
          upgradeStep: upgradeStatus.upgradeStep,
          proposalId: Number(newProposalId),
          versionHash,
        });
      }
    },
    [canControlUpgrade, onUpdate, upgradeStatus.upgradeStep, versionHash]
  );

  const handleViewProposalApprove = useCallback(async () => {
    if (!canControlUpgrade) {
      return;
    }

    const nextStep = getNextUpgradeStep(upgradeStatus.upgradeStep);

    await onUpdate({
      upgradeStep: nextStep,
      proposalId: null,
      versionHash,
    });

    if (nextStep === null) {
      // this is finalise action
      sendGAEvent({
        name: GA_EVENTS.DAO_UPGRADE_FINISHED,
        daoId: daoContext.dao.id,
        accountId,
      });
    }
  }, [
    accountId,
    canControlUpgrade,
    daoContext.dao.id,
    onUpdate,
    upgradeStatus.upgradeStep,
    versionHash,
  ]);

  const handleViewProposalReject = useCallback(async () => {
    if (!canControlUpgrade) {
      return;
    }

    await onUpdate({
      upgradeStep: null,
      proposalId: null,
      versionHash,
    });
  }, [canControlUpgrade, onUpdate, versionHash]);

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

  if (!steps || !stepProposalVariant) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.steps}>
        <CreationProgress steps={steps} />
      </div>
      <div className={styles.content}>
        <button
          tabIndex={-1}
          type="button"
          onClick={async e => {
            if (e.shiftKey) {
              await handleViewProposalReject();
            }
          }}
          className={styles.hidden}
        >
          Reset steps
        </button>
        {isViewProposal && proposal && (
          <ViewStepProposal
            isLastStep={
              upgradeStatus.upgradeStep === UpgradeSteps.RemoveUpgradeCode
            }
            canControlUpgrade={canControlUpgrade}
            proposal={proposal}
            onApproved={handleViewProposalApprove}
            onRejected={handleViewProposalReject}
          />
        )}
        {!isViewProposal && (
          <CreateProposal
            {...daoContext}
            onCreate={handleProposalCreate}
            redirectAfterCreation={false}
            onClose={() => null}
            daoTokens={{}}
            showFlag={false}
            showClose={false}
            showInfo={false}
            proposalVariant={stepProposalVariant}
            initialValues={{ versionHash }}
          />
        )}
      </div>
    </div>
  );
};
