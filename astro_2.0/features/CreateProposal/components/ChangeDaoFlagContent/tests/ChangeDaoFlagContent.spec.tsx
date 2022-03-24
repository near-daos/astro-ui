import { render } from 'jest/testUtils';

import { ChangeDaoFlagContent } from 'astro_2.0/features/CreateProposal/components/ChangeDaoFlagContent';

const formContextMock = {
  formState: {
    errors: {},
  },
  watch: () => 0,
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

describe('ChangeDaoFlagContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<ChangeDaoFlagContent daoId="123" />);

    expect(getByText('proposalCard.proposalTarget')).toBeTruthy();
  });
});
