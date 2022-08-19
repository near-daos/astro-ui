import { render } from 'jest/testUtils';

import { DAO } from 'types/dao';

import { ChangeBondsContent } from 'astro_2.0/features/CreateProposal/components/ChangeBondsContent';

const formContextMock = {
  register: () => 0,
  formState: {
    errors: {},
  },
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

describe('ChangeBondsContent', () => {
  it('Should render component', () => {
    const dao = {
      id: '123',
      policy: {
        proposalBond: '1',
        proposalPeriod: '2',
        bountyBond: '3',
        bountyForgivenessPeriod: '4',
      },
    } as unknown as DAO;

    const { container } = render(<ChangeBondsContent dao={dao} />);

    expect(container).toMatchSnapshot();
  });
});
