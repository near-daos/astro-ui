import { render } from 'jest/testUtils';

import { AppHeader } from 'astro_2.0/components/AppHeader';

describe('App Header', () => {
  it('Should render AppHeader component', () => {
    const { container } = render(<AppHeader />);

    expect(container).toMatchSnapshot();
  });
});
