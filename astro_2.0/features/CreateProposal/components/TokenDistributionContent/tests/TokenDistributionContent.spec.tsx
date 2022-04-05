import { render } from 'jest/testUtils';

import { TokenDistributionContent } from 'astro_2.0/features/CreateProposal/components/TokenDistributionContent';

const formContextMock = {
  formState: {
    errors: {},
    touchedFields: {},
  },
  watch: () => ({
    GR1: {
      groupTotal: 10,
      isCustom: true,
      members: ['M1'],
    },
    GR2: {
      groupTotal: 5,
      isCustom: true,
    },
    GR3: {
      groupTotal: 10,
      isCustom: false,
      members: ['M3'],
    },
  }),
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

describe('TokenDistributionContent', () => {
  const token = {
    name: 'GovToken',
    value: 123,
  };

  const groups = [
    {
      name: 'GR1',
      numberOfMembers: 1,
      members: ['M1'],
    },
    {
      name: 'GR2',
      numberOfMembers: 2,
      members: ['M2', 'M3'],
    },
  ];

  it('Should render component', () => {
    const { getByText } = render(
      <TokenDistributionContent groups={groups} governanceToken={token} />
    );

    expect(getByText('proposalCard.proposalOwner')).toBeTruthy();
  });
});
