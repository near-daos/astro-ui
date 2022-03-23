import { DAO } from 'types/dao';
import { Token } from 'types/token';

export const dao = ({
  id: 'legaldao.sputnikv2.testnet',
  policy: {
    proposalBond: '100000000000000000000000',
  },
} as unknown) as DAO;

export const data = {
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

export const tokens = ({
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
} as unknown) as Record<string, Token>;
