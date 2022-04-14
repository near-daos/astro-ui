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

export type Settings = {
  daoUpgrade: UpgradeStatus;
};
