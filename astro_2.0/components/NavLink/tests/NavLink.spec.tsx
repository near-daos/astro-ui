import { render } from 'jest/testUtils';

import { NavLink } from 'astro_2.0/components/NavLink';

describe('Nav Link', () => {
  it('Should render component', () => {
    const { container } = render(<NavLink>Click Me!</NavLink>);

    expect(container).toMatchSnapshot();
  });

  it('Should render proper href when provided', () => {
    const link = 'someLink';
    const { container } = render(<NavLink href={link}>Click Me!</NavLink>);

    expect(container.querySelector('a')?.href).toStrictEqual(
      `http://localhost/${link}`
    );
  });
});
