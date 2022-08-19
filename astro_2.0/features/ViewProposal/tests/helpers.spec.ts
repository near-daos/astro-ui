import { ProposalFeedItem } from 'types/proposal';
import { getProposalUpdatedDate } from 'astro_2.0/features/ViewProposal/helpers';

describe('ViewProposal helpers', () => {
  it('Extract updated at date from last available action', () => {
    const proposal = {
      updatedAt: '2022-07-27T22:39:52.173Z',
      actions: [
        {
          accountId: 'jasonborn.near',
          action: 'AddProposal',
          id: 'spy-dao-1-jasonborn.near-AddProposal',
          proposalId: 'spy-dao.sputnik-dao.near-1',
          timestamp: '1655214410034830814',
          transactionHash: 'some hash here',
        },
      ],
    } as ProposalFeedItem;

    expect(getProposalUpdatedDate(proposal)).toEqual(
      '2022-06-14T13:46:50.034Z'
    );
  });

  it('Uses updatedAt if no actions available', () => {
    const proposal = {
      updatedAt: '2022-07-27T22:39:52.173Z',
    } as ProposalFeedItem;

    expect(getProposalUpdatedDate(proposal)).toEqual(
      '2022-07-27T22:39:52.173Z'
    );
  });

  it('Uses updatedAt if actions are empty', () => {
    const proposal = {
      updatedAt: '2022-07-27T22:39:52.173Z',
      actions: [],
    } as unknown as ProposalFeedItem;

    expect(getProposalUpdatedDate(proposal)).toEqual(
      '2022-07-27T22:39:52.173Z'
    );
  });

  it('Sort provided actions', () => {
    const proposal = {
      updatedAt: '2022-07-27T22:39:52.173Z',
      actions: [
        {
          accountId: 'jasonborn.near',
          action: 'AddProposal',
          id: 'spy-dao-1-jasonborn.near-AddProposal',
          proposalId: 'spy-dao.sputnik-dao.near-1',
          timestamp: '1655214410034830814',
          transactionHash: 'some hash here',
        },
        {
          accountId: 'jasonborn.near',
          action: 'VoteApprove',
          id: 'spy-dao-1-jasonborn.near-AddProposal',
          proposalId: 'spy-dao.sputnik-dao.near-1',
          timestamp: '1655214410024830814',
          transactionHash: 'some hash here',
        },
        {
          accountId: 'jasonborn.near',
          action: 'VoteReject',
          id: 'spy-dao-1-jasonborn.near-AddProposal',
          proposalId: 'spy-dao.sputnik-dao.near-1',
          timestamp: '1655214410084830814',
          transactionHash: 'some hash here',
        },
      ],
    } as ProposalFeedItem;

    expect(getProposalUpdatedDate(proposal)).toEqual(
      '2022-06-14T13:46:50.084Z'
    );
  });
});
