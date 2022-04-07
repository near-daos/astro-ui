import { render } from 'jest/testUtils';

import { ContentPanel } from 'astro_2.0/features/Discover/components/ContentPanel';

describe('ContentPanel', () => {
  it('Should render component', () => {
    const title = 'Some Title';

    const { getByText } = render(<ContentPanel title={title} />);

    expect(getByText(title)).toBeTruthy();
  });
});
