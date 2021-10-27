const CONTRACT_NAME = 'sputnikv2.testnet';
const TOKEN_CONTRACT_NAME = 'tokens.testnet';

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
  tokenContractName: string;
  masterAccount?: string;
  walletUrl?: string;
  helperUrl?: string;
  explorerUrl?: string;
  keyPath?: string;
};

export const getNearConfig = (env: NEAR_ENV): NearConfig => {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        walletFormat: '.near',
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: 'sputnik-dao.near',
        tokenContractName: '',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'testnet':
    case 'development':
      return {
        walletFormat: '.testnet',
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: CONTRACT_NAME,
        tokenContractName: TOKEN_CONTRACT_NAME,
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
    case 'betanet':
      return {
        walletFormat: '.betanet',
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        tokenContractName: '',
        contractName: CONTRACT_NAME,
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org',
      };
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
        tokenContractName: '',
        contractName: CONTRACT_NAME,
      };
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        tokenContractName: '',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near',
      };
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        tokenContractName: '',
        contractName: CONTRACT_NAME,
        masterAccount: 'test.near',
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.ts.`
      );
  }
};
