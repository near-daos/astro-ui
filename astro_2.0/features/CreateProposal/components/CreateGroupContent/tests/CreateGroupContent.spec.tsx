/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { CreateGroupContent } from 'astro_2.0/features/CreateProposal/components/CreateGroupContent';

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

describe('CreateGroupContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<CreateGroupContent daoId="123" />);

    expect(getByText('proposalCard.proposalTarget')).toBeTruthy();
  });
});
