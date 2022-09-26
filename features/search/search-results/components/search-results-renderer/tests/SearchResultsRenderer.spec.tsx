import { render } from 'jest/testUtils';

import { SearchResultsRenderer } from 'features/search/search-results/components/search-results-renderer/SearchResultsRenderer';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
  };
});

jest.mock('react-text-truncate', () => {
  return () => <div />;
});

jest.mock('features/search/search-results/SearchResults', () => {
  return {
    useSearchResults: () => ({
      handleSearch: jest.fn(),
      searchResults: {
        query: 'hello',
        daos: [
          {
            createdAt: '2021-11-05T13:45:27.117Z',
            id: 'hello-world.sputnikv2.testnet',
            numberOfMembers: 1,
            numberOfGroups: 1,
            accountIds: ['alexeysputnik.testnet'],
            activeProposalCount: 0,
            totalProposalCount: 13,
            totalDaoFunds: 1190.7,
            txHash: 'o1QunbXu7FpJmesHXTM6bH74tx2KbKtM9sFK8J7ZCz8',
            name: 'hello-world',
            description: '',
            displayName: 'New Hello World!',
            links: ['youtube.com'],
            logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
            flagCover: '',
            flagLogo: '',
            legal: {},
            policy: {
              daoId: 'hello-world.sputnikv2.testnet',
              roles: [
                {
                  name: 'Everyone',
                  accountIds: ['alexeysputnik.testnet'],
                },
              ],
            },
          },
        ],
        proposals: [
          {
            voteYes: 1,
            voteNo: 0,
            voteRemove: 0,
            votes: {
              'vr-challenge.testnet': 'Yes',
            },
            id: '3xr-testnet.sputnikv2.testnet-0',
            proposalId: 0,
            daoId: '3xr-testnet.sputnikv2.testnet',
            proposer: 'luisf.testnet',
            commentsCount: 0,
            description:
              'Proposal to mint the "Collection of 2 by luisf.testnet" 3XR gallery\n          |\n          |\n          Preview: https://testnet.3xr.space/custom/kexcQM6BpcStpXg7LpqTsJ6koAumNLCqGjFT_7hFesc/?preview=true\n          |\n          |\n          Gallery: https://testnet.3xr.space/custom/kexcQM6BpcStpXg7LpqTsJ6koAumNLCqGjFT_7hFesc:hellovirtualworld.mintspace2.testnet',
            link: '',
            status: 'Approved',
            kind: {
              type: 'FunctionCall',
              receiverId: 'hellovirtualworld.mintspace2.testnet',
              actions: [
                {
                  methodName: 'nft_batch_mint',
                  args: 'eyJvd25lcl9pZCI6Imx1aXNmLnRlc3RuZXQiLCJtZXRhZGF0YSI6eyJyZWZlcmVuY2UiOiJrZXhjUU02QnBjU3RwWGc3THBxVHNKNmtvQXVtTkxDcUdqRlRfN2hGZXNjIiwiZXh0cmEiOiJjdXN0b20tM3hyLWdhbGxlcnkifSwibnVtX3RvX21pbnQiOjEsInJveWFsdHlfYXJncyI6eyJzcGxpdF9iZXR3ZWVuIjp7Im5hdGUudGVzdG5ldCI6MjgzMywiY2Fyb2xpbi50ZXN0bmV0IjoyODMzLCJuLnRlc3RuZXQiOjI4MzMsIjN4ci10ZXN0bmV0LnNwdXRuaWt2Mi50ZXN0bmV0Ijo1MDAsImx1aXNmLnRlc3RuZXQiOjEwMDF9LCJwZXJjZW50YWdlIjoxMDAwfSwic3BsaXRfb3duZXJzIjpudWxsfQ==',
                  deposit: '100000000000000000000000',
                  gas: '150000000000000',
                },
              ],
            },
            votePeriodEnd: '2022-01-22T18:01:40.857Z',
            votePeriodEndDate: '2022-01-22T18:01:40.857Z',
            voteStatus: 'Active',
            isFinalized: false,
            txHash: '',
            createdAt: '2022-01-20T11:29:36.345Z',
            dao: {
              id: '3xr-testnet.sputnikv2.testnet',
              name: '3xr-testnet',
              logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
              flagCover:
                'https://sputnik-dao.s3.eu-central-1.amazonaws.com/7l9I1KTpqNACTF1GWaHM5',
              flagLogo: '',
              legal: {
                legalStatus: '',
                legalLink: '',
              },
              numberOfMembers: 1,
              policy: {
                daoId: '3xr-testnet.sputnikv2.testnet',
                defaultVotePolicy: {
                  weightKind: 'RoleWeight',
                  quorum: '0',
                  kind: 'Ratio',
                  ratio: [1, 2],
                },
              },
            },
            daoDetails: {
              name: '3xr-testnet',
              displayName: '3xr-testnet',
              logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
            },
            proposalVariant: 'ProposeDefault',
            updatedAt: '2022-02-08T17:51:31.446Z',
            permissions: {
              isCouncil: false,
              canApprove: false,
              canReject: false,
              canDelete: false,
            },
          },
          {
            voteYes: 1,
            voteNo: 0,
            voteRemove: 0,
            votes: {
              'alexeysputnik.testnet': 'Yes',
            },
            id: 'hello-world.sputnikv2.testnet-12',
            proposalId: 12,
            daoId: 'hello-world.sputnikv2.testnet',
            proposer: 'alexeysputnik.testnet',
            commentsCount: 0,
            description: 'Give me 1 near from Give near to people',
            link: '',
            status: 'Approved',
            kind: {
              type: 'BountyDone',
              bountyId: 2,
              receiverId: 'alexeysputnik.testnet',
            },
            votePeriodEnd: '2021-12-27T21:55:09.520Z',
            votePeriodEndDate: '2021-12-27T21:55:09.520Z',
            voteStatus: 'Active',
            isFinalized: false,
            txHash: '2LbYgzgje6CbiyZqxmp8HUpCpit6F5sjgNfuauGwmgQz',
            createdAt: '2021-12-20T21:55:15.506Z',
            dao: {
              id: 'hello-world.sputnikv2.testnet',
              name: 'hello-world',
              logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
              flagCover: '',
              flagLogo: '',
              legal: {},
              numberOfMembers: 1,
              policy: {
                daoId: 'hello-world.sputnikv2.testnet',
                defaultVotePolicy: {
                  weightKind: 'RoleWeight',
                  quorum: '0',
                  kind: 'Ratio',
                  ratio: [1, 2],
                },
              },
            },
            daoDetails: {
              name: 'hello-world',
              displayName: 'New Hello World!',
              logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
            },
            proposalVariant: 'ProposeDoneBounty',
            updatedAt: '2022-02-08T17:50:03.700Z',
            permissions: {
              isCouncil: false,
              canApprove: true,
              canReject: true,
              canDelete: true,
            },
          },
        ],
        members: [
          {
            id: 'helloworld.testnet',
            name: 'helloworld.testnet',
            votes: 0,
            groups: ['council'],
          },
        ],
      },
    }),
  };
});

describe('SearchResultsRenderer', () => {
  it.skip('Should render component', () => {
    const { container } = render(<SearchResultsRenderer />);

    expect(container).toMatchSnapshot();
  });
});
