import { render } from 'jest/testUtils';

import { DaoDetailsPreview } from 'astro_2.0/components/DaoDetails/DaoDetailsPreview';

import { daoMock } from './mock';

describe('dao details preview', () => {
  it('Should render component', () => {
    const { container } = render(<DaoDetailsPreview dao={daoMock} />);

    expect(container).toMatchSnapshot();
  });
});
