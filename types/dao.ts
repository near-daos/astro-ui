export type CreateDaoParams = {
  name: string;
  amountToTransfer: string;
  purpose: string;
  council: string;
  bond: string;
  votePeriod: string;
  gracePeriod: string;
};

export type DaoItem = {
  id: string;
  amount: string;
  bond: string;
  purpose: string;
  votePeriod: string;
  numberOfProposals: number;
  numberOfMembers: number;
  council: string[];
  councilSeats: 1;
  createdAt: string;
  link?: string;
  status?: string;
  txHash: string;
  updatedAt: string;
};
