import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';
import { Icon } from 'components/Icon';

describe('account popup item', () => {
  it('Should render component', () => {
    const { container } = render(
      <AccountPopupItem icon={<Icon name="tokenNearBig" />} content="test" />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should call onClick', () => {
    const onClick = jest.fn();
    const component = render(
      <AccountPopupItem
        onClick={onClick}
        icon={<Icon name="tokenNearBig" />}
        content="test"
      />
    );

    fireEvent.click(component.getByRole('button'));

    expect(onClick).toBeCalled();
  });
});
