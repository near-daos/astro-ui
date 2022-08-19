import { DAO } from 'types/dao';
import { Token } from 'types/token';

import { BuyNftFromMintbaseInput } from 'astro_2.0/features/CreateProposal/helpers/proposalObjectHelpers';

export const dao = {
  id: 'legaldao.sputnikv2.testnet',
  name: 'legaldao',
  policy: {
    bountyBond: '100000000000000000000000',
    proposalBond: '100000000000000000000000',
    proposalPeriod: '100000000000000000000000',
    bountyForgivenessPeriod: '100000000000000000000000',
  },
} as unknown as DAO;

export const customFunctionCallData = {
  gas: 150,
  actionsGas: 0.15,
  externalUrl: '',
  details: 'asdfg',
  json: '{}',
  deposit: '0',
  methodName: 'nft_buy',
  smartContractAddress: 'some.testnet',
  token: 'NEAR',
};

export const nftFromMintbaseData = {
  tokenKey: 'tokenKey',
  price: 10,
  timeout: '100',
  timeoutGranularity: 'hours',
  actionsGas: 5,
  deposit: '2',
  details: 'some details',
  externalUrl: 'external url',
  token: 'NEAR',
  target: 'target',
} as BuyNftFromMintbaseInput;

export const transferMintbaseNFTInputData = {
  smartContractAddress: 'sc-address',
  tokenKey: '123:mint.near',
  actionsGas: 5,
  details: 'some details',
  externalUrl: 'external url',
  target: 'target',
};

export const buyNftFromParasInputData = {
  tokenKey: 'NEAR',
  price: 10,
  timeout: '100',
  actionsGas: 5,
  deposit: '10',
  details: 'some details',
  externalUrl: 'external url',
  token: 'NEAR',
  target: 'target',
  smartContractAddress: 'sc-address',
  methodName: 'some method',
};

export const swapsOnRefInputData = {
  poolId: 'poolId',
  tokenIn: 'T1',
  tokenOut: 'T2',
  amountIn: 10,
  amountOut: 100,
  amountInToken: '20',
  amountOutToken: '200',
  actionsGas: 5,
  details: 'some details',
  externalUrl: 'external url',
  target: 'target',
};

export const tokens = {
  NEAR: {
    createdAt: '2021-12-07T19:15:52.793Z',
    transactionHash: null,
    updateTransactionHash: null,
    createTimestamp: null,
    updateTimestamp: '1639053338980000000',
    id: 'NEAR',
    ownerId: '',
    totalSupply: '',
    decimals: 24,
    icon: null,
    name: null,
    reference: null,
    referenceHash: null,
    spec: null,
    symbol: 'NEAR',
    price: '10.68',
    balance: '5.1002',
    tokenId: '',
  },
} as unknown as Record<string, Token>;
