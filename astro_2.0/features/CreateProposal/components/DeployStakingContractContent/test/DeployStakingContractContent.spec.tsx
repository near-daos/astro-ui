/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useFormContext } from 'react-hook-form';

import { DeployStakingContractContent } from 'astro_2.0/features/CreateProposal/components/DeployStakingContractContent';

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

describe('ContractAcceptanceContent', () => {
  it('Should render component', () => {
    const { getByText } = render(<DeployStakingContractContent />);

    expect(
      getByText('proposalCard.deployStakingContract.unstakingPeriod')
    ).toBeTruthy();
  });

  it('Should render "hours"', () => {
    // @ts-ignore
    useFormContext.mockImplementation(() => ({
      ...formContextMock,
      watch: () => 123,
    }));

    const { getByText } = render(<DeployStakingContractContent />);

    expect(getByText('proposalCard.deployStakingContract.hours')).toBeTruthy();
  });
});
