import Decimal from 'decimal.js';
import { useTranslation } from 'next-i18next';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  CREATE_PROPOSAL_ACTION_TYPE,
  STAKING_CONTRACT_PREFIX,
} from 'constants/proposals';

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
import { StakeTokens } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/StakeTokens';
import { DelegateVoting } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/steps/DelegateVoting';

import {
  ProposalFeedItem,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import { DaoContext } from 'types/context';
import { CreateGovernanceTokenSteps, ProgressStatus } from 'types/settings';

import { SputnikHttpService } from 'services/sputnik';

import { DELEGATE_PAGE_URL } from 'constants/routing';
import { STAKE_TOKENS_KEY, DELEGATE_VOTING_KEY } from 'constants/localStorage';

import { useWalletContext } from 'context/WalletContext';

import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';
import {
  getInitialCreationPermissions,
  getInitialVotingPermissions,
} from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

import styles from './CreateGovernanceTokenWizard.module.scss';

interface Props {
  daoContext: DaoContext;
  onUpdate: ({
    step,
    proposalId,
    wizardCompleted,
  }: {
    step: CreateGovernanceTokenSteps | null;
    proposalId: number | null;
    wizardCompleted?: boolean;
  }) => Promise<void>;
  status: ProgressStatus;
}

export const CreateGovernanceTokenWizard: FC<Props> = ({
  daoContext,
  onUpdate,
  status,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { accountId } = useWalletContext();
  const [proposal, setProposal] = useState<ProposalFeedItem | null>(null);
  const steps = getCreateGovernanceTokenSteps(status, proposal, t);
  const stepProposalVariant =
    getCreateGovernanceTokenStepProposalVariant(status);
  const isCouncil = isCouncilUser(daoContext.dao, accountId);
  const proposalId = status?.proposalId;
  const isViewProposal = proposalId !== null;
  const canControl =
    isCouncil &&
    daoContext.userPermissions.isCanCreateProposals &&
    daoContext.userPermissions.allowedProposalsToCreate[
      ProposalType.UpgradeSelf
    ];

  const handleProposalCreate = useCallback(
    async (newProposalId: number | number[] | null) => {
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

  const handleViewProposalApprove = useCallback(
    async (opts: { symbol?: string; decimals?: number } = {}) => {
      if (!canControl) {
        return;
      }

      const nextStep = getNextCreateGovernanceTokenWizardStep(status.step);

      const isFinalise =
        status.step === CreateGovernanceTokenSteps.DelegateVoting &&
        nextStep === null;

      await onUpdate({
        ...status,
        ...opts,
        step: nextStep,
        proposalId: null,
        wizardCompleted: isFinalise,
      });

      if (isFinalise) {
        router.push({
          pathname: DELEGATE_PAGE_URL,
          query: { dao: daoContext.dao.id },
        });
      }
    },
    [canControl, daoContext.dao.id, onUpdate, router, status]
  );

  const handleViewProposalReject = useCallback(async () => {
    if (!canControl) {
      return;
    }

    await onUpdate({
      ...status,
      // step: null,
      proposalId: null,
    });
  }, [canControl, onUpdate, status]);

  useEffect(() => {
    (async () => {
      localStorage.setItem(CREATE_PROPOSAL_ACTION_TYPE, '');
      localStorage.setItem(STAKE_TOKENS_KEY, '');
      localStorage.setItem(DELEGATE_VOTING_KEY, '');

      if (proposalId !== undefined && proposalId !== null) {
        const res = await SputnikHttpService.getProposalById(
          `${proposalId}`.indexOf(daoContext.dao.id) === 0
            ? proposalId
            : `${daoContext.dao.id}-${proposalId}`,
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
          isLastStep={status.step === CreateGovernanceTokenSteps.DelegateVoting}
          canControlUpgrade={canControl}
          proposal={proposal}
          onApproved={handleViewProposalApprove}
          onRejected={handleViewProposalReject}
        />
      );
    }

    if (!isViewProposal) {
      let initialValues;

      const contractAddress = status.selectedToken || status.contractAddress;

      switch (stepProposalVariant) {
        case ProposalVariant.ProposeStakingContractDeployment:
          initialValues = {
            token: status.selectedToken || status.contractAddress,
            unstakingPeriod: new Decimal(daoContext.dao.policy.proposalPeriod)
              .div('3.6e12')
              .toString(),
            details:
              'Please pay attention that deploying a staking contract will cost 6N',
          };
          break;
        case ProposalVariant.ProposeAcceptStakingContract:
          initialValues = {
            contract: `${daoContext.dao.name}${STAKING_CONTRACT_PREFIX}`,
          };
          break;
        case ProposalVariant.ProposeUpdateVotePolicyToWeightVoting: {
          initialValues = {
            contractAddress,
            details: t('delegateVoting.policyDescription'),
            quorum: daoContext.dao.policy.defaultVotePolicy.quorum,
            balance: 1,
          };

          break;
        }
        case ProposalVariant.ProposeChangeProposalCreationPermissions: {
          initialValues = {
            details:
              'Update proposal creation permissions for newly created group Token Holders',
            policy: getInitialCreationPermissions(daoContext.dao),
            allowPolicyChange: true,
          };

          break;
        }
        case ProposalVariant.ProposeChangeProposalVotingPermissions: {
          initialValues = {
            details:
              'Update voting permissions for newly created group Token Holders',
            policy: getInitialVotingPermissions(daoContext.dao),
            allowPolicyChange: true,
          };

          break;
        }
        case ProposalVariant.ProposeStakeTokens: {
          if (!contractAddress) {
            return (
              <div>
                No contract address found. Please, reset steps and try again
              </div>
            );
          }

          return (
            <StakeTokens
              contractAddress={contractAddress}
              onSubmit={handleViewProposalApprove}
              daoName={daoContext.dao.name}
              daoId={daoContext.dao.id}
            />
          );
        }
        case ProposalVariant.ProposeDelegateVoting: {
          if (!contractAddress) {
            return (
              <div>
                No contract address found. Please, reset steps and try again
              </div>
            );
          }

          return (
            <DelegateVoting
              contractAddress={contractAddress}
              onSubmit={handleViewProposalApprove}
              dao={daoContext.dao}
            />
          );
        }
        default:
          initialValues = {};
          break;
      }

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
          initialValues={initialValues}
          actionType="createGovernanceToken"
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
        {/* <button */}
        {/*  onClick={() => */}
        {/*    onUpdate({ */}
        {/*      // contractAddress: 'portos.tokenfactory.testnet', */}
        {/*      proposalId: null, */}
        {/*      // flow: 1, */}
        {/*      step: null, */}
        {/*      wizardCompleted: false, */}
        {/*    }) */}
        {/*  } */}
        {/* /> */}
        {/*  update state */}
        {/* </button> */}
        {/* <button onClick={() => handleViewProposalApprove()}> */}
        {/*  proposal approved */}
        {/* </button> */}
        {renderContent()}
      </div>
    </div>
  );
};
