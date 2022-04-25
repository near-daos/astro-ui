import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { TextArea } from 'components/inputs/TextArea';

describe('TextArea', () => {
  it('Should render component', () => {
    const maxLength = 123;

    const { getByText } = render(
      <TextArea size="medium" maxLength={maxLength} />
    );

    expect(getByText(`/${maxLength}`, { exact: false })).toBeTruthy();
  });

  it('Should render label', () => {
    const label = 'Hello World!';

    const { getByText } = render(<TextArea label={label} isValid />);

    expect(getByText(label)).toBeTruthy();
  });

  it('Should call onChange callback', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(<TextArea onChange={onChange} />);

    fireEvent.change(getByTestId('ata-textarea'), {
      target: {
        value: '123',
      },
    });

    expect(onChange).toBeCalled();
  });
});
