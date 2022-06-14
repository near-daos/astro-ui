import { render } from 'jest/testUtils';

import { ProposalFeedItem } from 'types/proposal';

import { ViewVoteInOtherDao } from 'astro_2.0/features/ViewProposal/components/CustomFunctionCallContent/components/ViewVoteInOtherDao';

jest.mock('utils/fromBase64ToObj', () => {
  return {
    fromBase64ToObj: () => ({
      id: '4',
      action: 'Approve',
    }),
  };
});

describe('ViewVoteInOtherDao', () => {
  it('Should render component', () => {
    const proposal = {
      dao: {
        id: 'daoId',
      },
      kind: {
        actions: {},
        receiverId: 'receiverId',
      },
    } as ProposalFeedItem;

    const { getByText } = render(<ViewVoteInOtherDao proposal={proposal} />);

    expect(getByText('Approve')).toBeInTheDocument();
  });
});
