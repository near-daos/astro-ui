import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountDropdown/components/AccountPopupItem/index';
import { Icon } from 'components/Icon';

describe('account popup item', () => {
  it('Should render component', () => {
    const { container } = render(
      <AccountPopupItem icon={<Icon name="tokenNearBig" />}>
        test
      </AccountPopupItem>
    );

    expect(container).toMatchSnapshot();
  });

  it('Should call onClick', () => {
    const onClick = jest.fn();
    const component = render(
      <AccountPopupItem onClick={onClick} icon={<Icon name="tokenNearBig" />}>
        test
      </AccountPopupItem>
    );

    fireEvent.click(component.getByRole('button'));

    expect(onClick).toBeCalled();
  });
});
