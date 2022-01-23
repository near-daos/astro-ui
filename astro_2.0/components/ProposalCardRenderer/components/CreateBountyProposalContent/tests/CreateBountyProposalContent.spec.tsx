import { render } from 'jest/testUtils';
import { CreateBountyProposalContent } from 'astro_2.0/components/ProposalCardRenderer/components/CreateBountyProposalContent';

describe('create bounty proposal content', () => {
  const token = {
    id: '123',
    tokenId: '123',
    decimals: 10,
    symbol: 'T',
    icon: 'icon',
    balance: '100',
    price: '1',
  };

  it('Should render component', () => {
    const { container } = render(
      <CreateBountyProposalContent
        amount="1"
        token={token}
        availableClaims="0"
        daysToComplete="0"
      />
    );

    expect(container).toMatchSnapshot();
  });
});
