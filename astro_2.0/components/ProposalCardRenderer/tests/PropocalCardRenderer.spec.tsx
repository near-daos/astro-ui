import { render } from 'jest/testUtils';

import { ProposalCardRenderer } from 'astro_2.0/components/ProposalCardRenderer';

describe('proposal card renderer', () => {
  it('Should render component', () => {
    const { container } = render(
      <ProposalCardRenderer proposalCardNode={<div>Proposal Node</div>} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render dao flag node', () => {
    const daoFlagNode = 'Dao Flag Node';

    const { getAllByText } = render(
      <ProposalCardRenderer
        proposalCardNode={<div>Proposal Node</div>}
        daoFlagNode={daoFlagNode}
      />
    );

    expect(getAllByText(daoFlagNode)).toHaveLength(1);
  });

  it('Should render letter head node', () => {
    const letterHeadNode = 'Letter Head Node';

    const { getAllByText } = render(
      <ProposalCardRenderer
        proposalCardNode={<div>Proposal Node</div>}
        letterHeadNode={letterHeadNode}
      />
    );

    expect(getAllByText(letterHeadNode)).toHaveLength(1);
  });

  it('Should render info panel node', () => {
    const infoPanelNode = 'Info Panel Node';

    const { getAllByText } = render(
      <ProposalCardRenderer
        proposalCardNode={<div>Proposal Node</div>}
        infoPanelNode={infoPanelNode}
      />
    );

    expect(getAllByText(infoPanelNode)).toHaveLength(1);
  });
});
