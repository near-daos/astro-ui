import { render } from 'jest/testUtils';

import { ChangePolicyContent } from 'astro_2.0/features/CreateProposal/components/ChangePolicyContent';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  register: () => 0,
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

describe('ChangePolicyContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<ChangePolicyContent />);

    expect(getByText('proposalCard.person')).toBeTruthy();
  });
});
