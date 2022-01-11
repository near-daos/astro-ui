import { render } from 'jest/testUtils';

import { DaoFlagWidget } from 'astro_2.0/components/DaoFlagWidget';

describe('dao flag widget', () => {
  it('Should render component', () => {
    const { container } = render(
      <DaoFlagWidget daoId="123" daoName="Dao Name" />
    );

    expect(container).toMatchSnapshot();
  });
});
