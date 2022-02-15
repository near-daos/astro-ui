import { render } from 'jest/testUtils';

import { App404 } from 'astro_2.0/features/App404';

describe('App 404', () => {
  it('Should render component', () => {
    const { container } = render(<App404 />);

    expect(container).toMatchSnapshot();
  });
});
