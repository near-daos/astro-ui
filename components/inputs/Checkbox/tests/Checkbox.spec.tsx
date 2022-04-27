import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { Checkbox } from 'components/inputs/Checkbox';

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

describe('Checkbox', () => {
  it('Should render label', () => {
    const label = 'Hello World!';

    const { getByText } = render(<Checkbox label={label} />);

    expect(getByText(label)).toBeTruthy();
  });

  it('Should render checked icon', () => {
    const { getByRole, getByText } = render(<Checkbox />);

    fireEvent.click(getByRole('checkbox'));

    expect(getByText('checkboxChecked')).toBeTruthy();
  });
});
