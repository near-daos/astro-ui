export type CreateTokenParams = {
  name: string;
  symbol: string;
  icon: string;
};

export enum TokenDeprecated {
  NEAR = 'NEAR',
}

export type NftTokenResponse = {
  id: string;
  tokenId: string;
  ownerId: string;
  contractId: string;
  minter: string;
  baseUri: string;
  symbol: string;
  icon: string;
  reference: string;
  referenceHash: string;
  metadata: {
    copies: 0;
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
  contract: {
    id: string;
    spec: string;
    name: string;
    symbol: string;
    icon: string;
    baseUri: string;
    reference: string;
    referenceHash: string;
  };
};

export type GetNFTTokensResponse = {
  data: NftTokenResponse[];
};

export type NFTUri = {
  uri: string;
  isExternalReference: boolean;
};

export type NftToken = {
  id: string;
  uri: NFTUri[];
  description: string;
  isExternalReference: boolean;
  contractId: string;
  contractName: string;
  tokenId: string;
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
  price: string | null;
};

export type Token = {
  id: string;
  tokenId: string;
  decimals: number;
  symbol: string;
  icon: string;
  totalSupply?: string;
  balance: string;
  price: string | null;
};

export type Tokens = Record<string, Token>;

export type GetTokensResponse = {
  data: TokenResponse[];
};

export type GovernanceToken = {
  name: string;
  value: number;
};
