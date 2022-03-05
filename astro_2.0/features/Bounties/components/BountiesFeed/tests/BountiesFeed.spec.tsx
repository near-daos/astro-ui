import React from 'react';
import { render } from 'jest/testUtils';

import { BountiesFeed } from 'astro_2.0/features/Bounties/components/BountiesFeed';

describe('BountiesFeed', () => {
  it('Should render component', () => {
    const data = {
      count: 0,
      total: 0,
      page: 0,
      pageCount: 0,
      data: [],
    };

    const { container } = render(<BountiesFeed initialData={data} />);

    expect(container).toMatchSnapshot();
  });
});
