export type CreateTokenParams = {
  name: string;
  symbol: string;
  icon: string;
};

export enum TokenDeprecated {
  NEAR = 'NEAR'
}

export type NftToken = {
  id: string;
  ownerId: string;
  tokenId: string;
  minter: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: number;
  updateTimestamp: number;
  metadata: {
    tokenId: string;
    copies: number;
    description: string;
    expiresAt: string;
    extra: string;
    issuedAt: string;
    media: string;
    mediaHash: string;
    reference: string;
    referenceHash: string;
    startsAt: string;
    title: string;
    updatedAt: string;
    approvedAccountIds: [string];
  };
};

export type TokenResponse = {
  transactionHash: string;
  id: string;
  ownerId: string;
  tokenId: string;
  totalSupply: string;
  decimals: number;
  icon: string;
  name: string;
  spec: string;
  symbol: string;
  balance: string;
};

export type Token = {
  tokenId: string;
  decimals: number;
  symbol: string;
  icon: string;
  totalSupply?: string;
  balance: string;
};

export type GetTokensResponse = {
  data: TokenResponse[];
};
