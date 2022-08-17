/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { UpdateVotePolicyToWeightVoting } from 'astro_2.0/features/CreateProposal/components/UpdateVotePolicyToWeightVoting/index';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
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

describe('VotePolicyToWeightVotingUpdateContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<UpdateVotePolicyToWeightVoting />);

    expect(
      getByText('Threshold - Minimum votes to pass or reject a proposal.')
    ).toBeTruthy();
  });
});
