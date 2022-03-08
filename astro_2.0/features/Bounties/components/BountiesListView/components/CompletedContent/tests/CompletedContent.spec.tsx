import { render } from 'jest/testUtils';

import { CompletedContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/CompletedContent';

describe('CompletedContent', () => {
  it('Should render component', () => {
    const { container } = render(
      <CompletedContent slots={10} slotsTotal={10} />
    );

    expect(container).toMatchSnapshot();
  });
});
