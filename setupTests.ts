import '@testing-library/jest-dom';

jest.mock('config/near', () => ({
  ...jest.requireActual('config/near'),
  getNearConfig: jest.fn().mockReturnValue({
    networkId: 'shared-test',
    nodeUrl: 'https://rpc.ci-testnet.near.org',
    tokenContractName: '',
    contractName: 'sputnikv2.testnet',
    masterAccount: 'test.near',
    headers: {},
    explorerUrl: 'https://explorer.testnet.near.org',
  }),
}));
