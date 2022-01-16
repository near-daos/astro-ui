import { render } from 'jest/testUtils';

import { DaoDetailsSkeleton } from 'astro_2.0/components/DaoDetails/DaoDetailsGrid/components/DaoDetailsSkeleton';

describe('dao details skeleton', () => {
  it('Should render component', () => {
    const { container } = render(<DaoDetailsSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
