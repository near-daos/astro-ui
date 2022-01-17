import { render } from 'jest/testUtils';

import { DotsLoader } from 'astro_2.0/components/DotsLoader';

describe('dots loader', () => {
  it('Should render component', () => {
    const { container } = render(<DotsLoader />);

    expect(container).toMatchSnapshot();
  });
});
