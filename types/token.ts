import { BigSource } from 'big.js';
import { Contract } from 'near-api-js';

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

export type NftToken = {
  id: string;
  uri: string;
  description: string;
  title: string;
  isExternalImage: boolean;
  isExternalReference: boolean;
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

// Not sure about these typings, feel free to update them if you are sure
type SputnikTokenServiceMethods = {
  /* eslint-disable camelcase */
  get_required_deposit?: (params: {
    args: unknown;
    account_id: string;
  }) => Promise<BigSource>;
  get_number_of_tokens?: () => Promise<number>;
  get_tokens?: (params: {
    from_index: number;
    limit: number;
  }) => Promise<Token[]>;
  get_token?: () => Promise<Token>;

  create_token?: (
    params: {
      args: {
        owner_id: string;
        total_supply: string;
        metadata: {
          spec: string;
          decimals: number;
          name: string;
          symbol: string;
          icon: string;
        };
      };
    },
    boatOfGas: string
  ) => Promise<unknown>;
  storage_deposit?: string;
  /* eslint-enable camelcase */
};

export type SputnikTokenService<T = SputnikTokenServiceMethods> = Contract & T;
