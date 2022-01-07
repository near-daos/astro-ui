import { render } from 'jest/testUtils';

import { AppFooter } from 'astro_2.0/components/AppFooter';

describe('App Footer', () => {
  it('Should render AppFooter component', () => {
    const { container } = render(<AppFooter />);

    expect(container).toMatchSnapshot();
  });
});
