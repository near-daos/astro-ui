import { render } from 'jest/testUtils';

import { CustomContent } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/components/CustomContent';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => 0,
  register: () => 0,
  getValues: () => ({}),
};

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

describe('CustomContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<CustomContent />);

    expect(getByText('Smart Contract Address')).toBeTruthy();
  });
});
