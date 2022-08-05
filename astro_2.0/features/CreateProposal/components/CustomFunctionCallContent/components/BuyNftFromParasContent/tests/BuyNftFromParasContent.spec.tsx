import { render } from 'jest/testUtils';

import { BuyNftFromParasContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/BuyNftFromParasContent';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  register: () => 0,
  watch: () => 0,
  setValue: () => 0,
  getValues: () => ({}),
};

jest.mock('context/DaoTokensContext', () => {
  return {
    useDaoCustomTokens: jest.fn().mockReturnValue({ tokens: {} }),
  };
});

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('BuyNftFromParasContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<BuyNftFromParasContent />);

    expect(getByText('Token Id')).toBeTruthy();
  });
});
