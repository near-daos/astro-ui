import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { SaveButton } from 'astro_2.0/features/pages/myAccount/cards/WalletIdCard/components/AddUserInfoModal/components/SaveButton';

const code = '123';
const formContextMock = {
  watch: () => code,
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook does not generate warnings in console
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('SaveButton', () => {
  it('Should render component', () => {
    const tBase = 'biba';
    const { getByText } = render(
      <SaveButton tBase={tBase} onClick={() => Promise.resolve()} />
    );

    expect(getByText(`biba.save`)).toBeTruthy();
  });

  it('Should call onClick', () => {
    const onClick = jest.fn(() => Promise.resolve());

    const { getByRole } = render(<SaveButton tBase="" onClick={onClick} />);

    fireEvent.click(getByRole('button'));

    expect(onClick).toBeCalledWith(code);
  });
});
