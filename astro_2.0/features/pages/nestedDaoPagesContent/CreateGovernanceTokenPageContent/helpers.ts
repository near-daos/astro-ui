import {
  CreateGovernanceTokenFlow,
  CreateGovernanceTokenSteps,
  ProgressStatus,
} from 'types/settings';
import { TFunction } from 'next-i18next';
import { ProposalFeedItem, ProposalVariant } from 'types/proposal';

type Step = {
  label: string;
  value: string;
  isCurrent: boolean;
  isHidden?: boolean;
};

const T_BASE = 'createGovernanceTokenPage.createToken.progress';

function getSteps(t: TFunction) {
  const steps: Step[] = [
    {
      label: t(`${T_BASE}.createToken`),
      value: 'createToken',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.deployStakingContract`),
      value: 'deployStakingContract',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.acceptStakingContract`),
      value: 'acceptStakingContract',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.changeDaoPolicy`),
      value: 'changeDaoPolicy',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.proposalCreation`),
      value: 'changeDaoPolicy',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.votingPermissions`),
      value: 'changeDaoPolicy',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.stakeTokens`),
      value: 'stakeTokens',
      isCurrent: false,
    },
    {
      label: t(`${T_BASE}.delegateVoting`),
      value: 'delegateVoting',
      isCurrent: false,
    },
  ];

  return steps;
}

export function getCreateGovernanceTokenSteps(
  status: ProgressStatus,
  proposal: ProposalFeedItem | null,
  t: TFunction
): Step[] | null {
  if (!status) {
    return null;
  }

  const { step, flow } = status;

  const steps = getSteps(t);

  return steps
    ?.map((currentStep, ind) => {
      const index = ind + 1;

      const isComplete =
        index < step || (index <= step && proposal?.status === 'Approved');

      let stepContent = currentStep;

      if (
        currentStep.value === 'createToken' &&
        flow === CreateGovernanceTokenFlow.SelectToken
      ) {
        stepContent = {
          ...stepContent,
          label: t(`${T_BASE}.selectToken`),
        };
      }

      return index === step
        ? { ...stepContent, isCurrent: true, isComplete }
        : { ...stepContent, isCurrent: false, isComplete };
    })
    .filter(st => !st.isHidden);
}

export function getCreateGovernanceTokenStepProposalVariant(
  status: ProgressStatus
): ProposalVariant | null {
  if (!status) {
    return null;
  }

  const { step, flow } = status;

  switch (step) {
    case CreateGovernanceTokenSteps.CreateToken: {
      return flow !== CreateGovernanceTokenFlow.SelectToken
        ? ProposalVariant.ProposeCreateToken
        : null;
    }
    case CreateGovernanceTokenSteps.ContractAcceptance: {
      return ProposalVariant.ProposeStakingContractDeployment;
    }
    case CreateGovernanceTokenSteps.AcceptStakingContract: {
      return ProposalVariant.ProposeAcceptStakingContract;
    }
    case CreateGovernanceTokenSteps.ChangeDaoPolicy: {
      return ProposalVariant.ProposeUpdateVotePolicyToWeightVoting;
    }
    case CreateGovernanceTokenSteps.ProposalCreationPolicy: {
      return ProposalVariant.ProposeChangeProposalCreationPermissions;
    }
    case CreateGovernanceTokenSteps.ProposalVotingPolicy: {
      return ProposalVariant.ProposeChangeProposalVotingPermissions;
    }
    case CreateGovernanceTokenSteps.StakeTokens: {
      return ProposalVariant.ProposeStakeTokens;
    }
    case CreateGovernanceTokenSteps.DelegateVoting: {
      return ProposalVariant.ProposeDelegateVoting;
    }
    default: {
      return null;
    }
  }
}

export function getNextCreateGovernanceTokenWizardStep(
  currentStep: CreateGovernanceTokenSteps
): CreateGovernanceTokenSteps | null {
  switch (currentStep) {
    case CreateGovernanceTokenSteps.ChooseFlow: {
      return CreateGovernanceTokenSteps.CreateToken;
    }
    case CreateGovernanceTokenSteps.CreateToken: {
      return CreateGovernanceTokenSteps.ContractAcceptance;
    }
    case CreateGovernanceTokenSteps.ContractAcceptance: {
      return CreateGovernanceTokenSteps.AcceptStakingContract;
    }
    case CreateGovernanceTokenSteps.AcceptStakingContract: {
      return CreateGovernanceTokenSteps.ChangeDaoPolicy;
    }
    case CreateGovernanceTokenSteps.ChangeDaoPolicy: {
      return CreateGovernanceTokenSteps.ProposalCreationPolicy;
    }
    case CreateGovernanceTokenSteps.ProposalCreationPolicy: {
      return CreateGovernanceTokenSteps.ProposalVotingPolicy;
    }
    case CreateGovernanceTokenSteps.ProposalVotingPolicy: {
      return CreateGovernanceTokenSteps.StakeTokens;
    }
    case CreateGovernanceTokenSteps.StakeTokens: {
      return CreateGovernanceTokenSteps.DelegateVoting;
    }
    case CreateGovernanceTokenSteps.DelegateVoting: {
      return null;
    }
    default: {
      return null;
    }
  }
}
