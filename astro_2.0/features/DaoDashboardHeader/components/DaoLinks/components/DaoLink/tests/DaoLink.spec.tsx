import { render } from 'jest/testUtils';

import { DaoLink } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/DaoLink';

describe('DaoLink', () => {
  it('Should render component', () => {
    const { getByText } = render(<DaoLink link="https://www.youtube.com" />);

    expect(getByText('www.youtube.com')).toBeTruthy();
  });
});
