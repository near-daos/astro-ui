import { render } from 'jest/testUtils';

import { DaoLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks';

describe('DaoLinks', () => {
  it('Should render component', () => {
    const { getByText } = render(
      <DaoLinks
        links={['L1', 'L2']}
        legal={{
          legalLink: 'LL1',
        }}
      />
    );

    expect(getByText('Public Limited Company')).toBeTruthy();
  });
});
