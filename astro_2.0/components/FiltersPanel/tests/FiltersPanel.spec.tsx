import { render } from 'jest/testUtils';

import { FiltersPanel } from 'astro_2.0/components/FiltersPanel';

describe('Filters Panel', () => {
  it('Should render component', () => {
    const { container } = render(<FiltersPanel />);

    expect(container).toMatchSnapshot();
  });
});
