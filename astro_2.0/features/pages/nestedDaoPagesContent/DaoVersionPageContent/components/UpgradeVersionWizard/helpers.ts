import { UpgradeStatus, UpgradeSteps } from 'types/settings';
import { ProposalFeedItem, ProposalVariant } from 'types/proposal';

type Step = {
  label: string;
  value: string;
  isCurrent: boolean;
};

const upgradeSteps: Step[] = [
  {
    label: 'Get Code From Factory',
    value: 'getLatestCode',
    isCurrent: true,
  },
  {
    label: 'Upgrade DAO',
    value: 'upgradeSelf',
    isCurrent: false,
  },
  {
    label: 'Recover Storage Costs',
    value: 'removeUpgradeCodeBlob',
    isCurrent: false,
  },
];

export function getVersionUpgradeSteps(
  upgradeStatus: UpgradeStatus,
  proposal: ProposalFeedItem | null
): Step[] | null {
  if (!upgradeStatus) {
    return null;
  }

  const { upgradeStep } = upgradeStatus;

  return upgradeSteps?.map((value, index) => {
    const isComplete =
      index < upgradeStep ||
      (index <= upgradeStep && proposal?.status === 'Approved');

    return index === upgradeStep
      ? { ...value, isCurrent: true, isComplete }
      : { ...value, isCurrent: false, isComplete };
  });
}

export function getStepProposalVariant(
  upgradeStatus: UpgradeStatus
): ProposalVariant | null {
  if (!upgradeStatus) {
    return null;
  }

  const { upgradeStep } = upgradeStatus;

  switch (upgradeStep) {
    case UpgradeSteps.UpgradeSelf: {
      return ProposalVariant.ProposeUpgradeSelf;
    }
    case UpgradeSteps.RemoveUpgradeCode: {
      return ProposalVariant.ProposeRemoveUpgradeCode;
    }
    default:
    case UpgradeSteps.GetUpgradeCode: {
      return ProposalVariant.ProposeGetUpgradeCode;
    }
  }
}

export function getNextUpgradeStep(
  currentStep: UpgradeSteps
): UpgradeSteps | null {
  switch (currentStep) {
    case UpgradeSteps.UpgradeSelf: {
      return UpgradeSteps.RemoveUpgradeCode;
    }
    case UpgradeSteps.RemoveUpgradeCode: {
      return null;
    }
    default:
    case UpgradeSteps.GetUpgradeCode: {
      return UpgradeSteps.UpgradeSelf;
    }
  }
}
