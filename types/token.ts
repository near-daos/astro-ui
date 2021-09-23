export type CreateTokenParams = {
  name: string;
  symbol: string;
  icon: string;
};

export enum Token {
  NEAR = 'NEAR'
}

export type TokenType = {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  transactionHash: string | null;
  updateTransactionHash: string | null;
  createTimestamp: number | null;
  updateTimestamp: number | null;
  id: string;
  ownerId: string;
  totalSupply: string;
  decimals: number;
  icon: string;
  name: string;
  reference: string | null;
  referenceHash: string | null;
  spec: string;
  symbol: string;
};

export type GetTokensResponse = {
  data: TokenType[];
};
