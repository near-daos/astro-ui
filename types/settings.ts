export enum UpgradeSteps {
  GetUpgradeCode,
  UpgradeSelf,
  RemoveUpgradeCode,
}

export type UpgradeStatus = {
  upgradeStep: UpgradeSteps;
  proposalId?: string;
  versionHash: string;
};

export enum CreateGovernanceTokenFlow {
  CreateToken,
  SelectToken,
}

export enum CreateGovernanceTokenSteps {
  ChooseFlow,
  CreateToken,
  ContractAcceptance,
  AcceptStakingContract,
  ChangeDaoPolicy,
  ProposalCreationPolicy,
  ProposalVotingPolicy,
  StakeTokens,
  DelegateVoting,
}

export type ProgressStatus = {
  step: CreateGovernanceTokenSteps;
  proposalId?: string | null;
  flow: CreateGovernanceTokenFlow;
  selectedToken?: string;
  contractAddress?: string;
  wizardCompleted?: boolean;
};

export type Settings = {
  daoUpgrade?: UpgradeStatus;
  cloneState?: {
    proposalId?: number | null;
    isFlowCompleted: boolean;
    target?: string;
    transferDone?: boolean;
  };
  createGovernanceToken?: ProgressStatus;
  features: Record<string, boolean>;
  drafts?: {
    allowCreateDraftByAnyUser: boolean;
  };
};
