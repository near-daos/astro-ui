import {
  CreateGovernanceTokenFlow,
  CreateGovernanceTokenSteps,
  ProgressStatus,
} from 'types/settings';
import { ProposalFeedItem, ProposalVariant } from 'types/proposal';

type Step = {
  label: string;
  value: string;
  isCurrent: boolean;
  isHidden?: boolean;
};

const steps: Step[] = [
  {
    label: 'Create Token',
    value: 'createToken',
    isCurrent: false,
  },
  {
    label: 'Contract Acceptance',
    value: 'contractAcceptance',
    isCurrent: false,
  },
  {
    label: 'Token Distribution',
    value: 'tokenDistribution',
    isCurrent: false,
  },
  {
    label: 'Change DAO Policy',
    value: 'changeDaoPolicy',
    isCurrent: false,
  },
];

export function getCreateGovernanceTokenSteps(
  status: ProgressStatus,
  proposal: ProposalFeedItem | null
): Step[] | null {
  if (!status) {
    return null;
  }

  const { step, flow } = status;

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
          label: 'Select Token',
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
      return ProposalVariant.ProposeContractAcceptance;
    }
    case CreateGovernanceTokenSteps.TokenDistribution: {
      return ProposalVariant.ProposeTokenDistribution;
    }
    case CreateGovernanceTokenSteps.ChangeDaoPolicy: {
      return ProposalVariant.ProposeChangeVotingPolicy;
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
      return CreateGovernanceTokenSteps.TokenDistribution;
    }
    case CreateGovernanceTokenSteps.TokenDistribution: {
      return CreateGovernanceTokenSteps.ChangeDaoPolicy;
    }
    case CreateGovernanceTokenSteps.ChangeDaoPolicy: {
      return null;
    }
    default: {
      return null;
    }
  }
}
