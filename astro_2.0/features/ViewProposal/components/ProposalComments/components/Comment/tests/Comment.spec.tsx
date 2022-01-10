import { render } from 'jest/testUtils';

import { Comment } from 'astro_2.0/features/ViewProposal/components/ProposalComments/components/Comment';

const onDelete = jest.fn();
const onReport = jest.fn();

describe('Comment', () => {
  it('Should render Comment component', () => {
    const { container } = render(
      <Comment
        accountId="james.testnet"
        commentId={1}
        isMyComment
        createdAt="2022-01-10T18:39:04.672Z"
        isCouncilUser={false}
        isReported={false}
        onDelete={onDelete}
        onReport={onReport}
        reportsCount={1}
        message="My name is Bond. James bond."
      />
    );

    expect(container).toMatchSnapshot();
  });
});
