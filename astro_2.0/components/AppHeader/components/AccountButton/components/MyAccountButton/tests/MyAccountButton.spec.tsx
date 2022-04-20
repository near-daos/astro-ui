import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { MyAccountButton } from 'astro_2.0/components/AppHeader/components/AccountButton/components/MyAccountButton';

describe('MyAccountButton', () => {
  it('Should handle click properly ', () => {
    const closeDropdown = jest.fn();

    const { getByRole } = render(
      <MyAccountButton closeDropdown={closeDropdown} />
    );

    fireEvent.click(getByRole('button'));

    expect(closeDropdown).toBeCalled();
  });
});
