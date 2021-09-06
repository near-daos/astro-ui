export type CreateDaoParams = {
  name: string;
  amountToTransfer: string;
  purpose: string;
  council: string;
  bond: string;
  votePeriod: string;
  gracePeriod: string;
};

export type TPermission =
  | '*:Finalize'
  | '*:AddProposal'
  | '*:VoteApprove'
  | '*:VoteReject'
  | '*:VoteRemove';

export type TRole = {
  kind: 'Everyone' | { group: string[] };
  name: string;
  permissions: TPermission[];
  votePolicy: unknown;
};

export type TVotePolicy = {
  quorum: string;
  threshold: number[];
  weightKind: 'RoleWeight';
};

export type TPolicy = {
  bountyBond: string;
  bountyForgivenessPeriod: string;
  createdAt: string;
  daoId: string;
  defaultVotePolicy: TVotePolicy;
  proposalBond: string;
  proposalPeriod: string;
  roles: TRole[];
};

export type DaoItem = {
  amount: string;
  createTimestamp: string;
  createdAt: string;
  description: string | null;
  id: string;
  lastBountyId: number;
  lastProposalId: number;
  link: string | null;
  metadata: string;
  name: string;
  policy: TPolicy;
  purpose: string;
  stakingContract: string;
  status: 'Success';
  totalSupply: string;
  transactionHash: string;
  updateTimestamp: string;
};
