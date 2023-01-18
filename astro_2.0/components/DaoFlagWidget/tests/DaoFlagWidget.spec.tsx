import { render } from 'jest/testUtils';

import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';

describe('dao flag widget', () => {
  it('Should render component', () => {
    const { container } = render(
      <DaoFlagWidget dao={{ id: '1', name: '1', flagLogo: '', logo: '' }} />
    );

    expect(container).toMatchSnapshot();
  });
});
