import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { AccountPopupItem } from 'astro_2.0/components/AppHeader/components/AccountButton/components/AccountPopupItem';

describe('account popup item', () => {
  it('Should render component', () => {
    const { container } = render(<AccountPopupItem>Hey</AccountPopupItem>);

    expect(container).toMatchSnapshot();
  });

  it('Should call onClick', () => {
    const onClick = jest.fn();
    const component = render(
      <AccountPopupItem onClick={onClick}>Hey</AccountPopupItem>
    );

    fireEvent.click(component.getByRole('button'));

    expect(onClick).toBeCalled();
  });
});
