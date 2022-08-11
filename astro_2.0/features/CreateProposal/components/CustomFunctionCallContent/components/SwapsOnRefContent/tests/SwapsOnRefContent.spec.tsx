import { render } from 'jest/testUtils';

import { SwapsOnRefContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/SwapsOnRefContent';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => 0,
  register: () => 0,
  setValue: () => 0,
  getValues: () => ({}),
};

jest.mock('react-hook-form', () => {
  return {
    useFormContext: jest.fn(() => formContextMock),
  };
});

jest.mock('context/DaoTokensContext', () => {
  return {
    useDaoCustomTokens: jest.fn().mockReturnValue({ tokens: {} }),
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

describe('SwapsOnRefContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<SwapsOnRefContent />);

    expect(getByText('TGas')).toBeTruthy();
  });
});
