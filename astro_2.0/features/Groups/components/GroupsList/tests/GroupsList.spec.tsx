import { render } from 'jest/testUtils';

import { GroupsList } from 'astro_2.0/features/Groups/components';

describe('GroupsList', () => {
  it('Should render groups', () => {
    const gr1 = 'gr1';
    const gr2 = 'gr2';

    const { getByText } = render(<GroupsList daoId="id" groups={[gr1, gr2]} />);

    expect(getByText(gr1)).toBeInTheDocument();
    expect(getByText(gr2)).toBeInTheDocument();
  });
});
