import { render } from 'jest/testUtils';

import { HeaderWithFilter } from 'astro_2.0/features/dao/HeaderWithFilter';

describe('HeaderWithFilter', () => {
  it('Should render component', () => {
    const title = 'My Title';
    const children = 'My Children';

    const { getByText } = render(
      <HeaderWithFilter title={title}>{children}</HeaderWithFilter>
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(children)).toBeInTheDocument();
  });
});
