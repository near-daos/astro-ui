import { render } from 'jest/testUtils';

import { DaoAddressLink } from 'components/DaoAddressLink';
import { fireEvent } from '@testing-library/dom';

describe('DaoAddressLink', () => {
  it('Should render nothing if no dao address', () => {
    const { container } = render(<DaoAddressLink daoAddress="" />);

    expect(container).toMatchSnapshot();
  });

  it('Should render component', () => {
    const { container } = render(<DaoAddressLink daoAddress="HelloWorld!" />);

    expect(container).toMatchSnapshot();
  });

  it('Should call stopPropagation on click', () => {
    const daoAddress = 'HelloWorld!';

    jest
      .spyOn(Event.prototype, 'stopPropagation')
      .mockImplementationOnce(jest.fn());

    const { getByText } = render(<DaoAddressLink daoAddress="HelloWorld!" />);

    fireEvent.click(getByText(daoAddress));

    expect(Event.prototype.stopPropagation).toBeCalled();
  });
});
