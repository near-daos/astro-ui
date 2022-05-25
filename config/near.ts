import { Config } from 'types/config';

export type NEAR_ENV =
  | 'production'
  | 'development'
  | 'local'
  | 'test'
  | 'mainnet'
  | 'betanet'
  | 'testnet'
  | 'ci'
  | 'ci-betanet';

export type NearConfig = {
  walletFormat?: string;
  networkId: string;
  nodeUrl: string;
  contractName: string;
  tokenFactoryContractName: string;
  masterAccount?: string;
  walletUrl?: string;
  helperUrl?: string;
  explorerUrl?: string;
  keyPath?: string;
  headers: { [key: string]: string | number };
};

export const getNearConfig = (config: Config): NearConfig => {
  // const CONTRACT_NAME = config?.NEAR_CONTRACT_NAME ?? 'sputnikv2.testnet';
  // const TOKEN_FACTORY_CONTRACT_NAME =
  //   config?.TOKEN_FACTORY_CONTRACT_NAME ?? 'tokens.testnet';
  const env = config?.NEAR_ENV ?? 'development';

  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        walletFormat: '.near',
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: 'sputnik-dao.near',
        tokenFactoryContractName: config.TOKEN_FACTORY_CONTRACT_NAME,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        headers: {},
      };
    case 'testnet':
    case 'development':
      return {
        walletFormat: '.testnet',
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: config.NEAR_CONTRACT_NAME,
        tokenFactoryContractName: config.TOKEN_FACTORY_CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        headers: {},
      };
    case 'betanet':
      return {
        walletFormat: '.betanet',
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        tokenFactoryContractName: '',
        contractName: config.NEAR_CONTRACT_NAME,
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org',
        headers: {},
      };
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
        tokenFactoryContractName: config.TOKEN_FACTORY_CONTRACT_NAME,
        contractName: config.NEAR_CONTRACT_NAME,
        headers: {},
      };
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        tokenFactoryContractName: config.TOKEN_FACTORY_CONTRACT_NAME,
        contractName: config.NEAR_CONTRACT_NAME,
        masterAccount: 'test.near',
        headers: {},
      };
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        tokenFactoryContractName: config.TOKEN_FACTORY_CONTRACT_NAME,
        contractName: config.NEAR_CONTRACT_NAME,
        masterAccount: 'test.near',
        headers: {},
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.ts.`
      );
  }
};
