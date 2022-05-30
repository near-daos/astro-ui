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
  TokenDistribution,
  ChangeDaoPolicy,
}

export type ProgressStatus = {
  step: CreateGovernanceTokenSteps;
  proposalId?: string;
  flow: CreateGovernanceTokenFlow;
};

export type Settings = {
  daoUpgrade?: UpgradeStatus;
  cloneState?: { proposalId?: number | null; isFlowCompleted: boolean };
  createGovernanceToken?: ProgressStatus;
  features: Record<string, boolean>;
};
