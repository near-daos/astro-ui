import { render } from 'jest/testUtils';

import { DaoDashboardHeader } from 'astro_2.0/features/DaoDashboardHeader';

import { dao, daoDescription } from './mocks';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(),
  };
});

jest.mock('astro_2.0/features/DaoDashboardHeader/components/hooks', () => {
  return {
    useJoinDao: () => ({
      showButton: true,
      showWarning: true,
    }),
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

describe('DaoDashboardHeader', () => {
  it('Should render component', () => {
    const { getByText } = render(
      <DaoDashboardHeader
        dao={dao}
        onCreateProposal={() => 0}
        userPermissions={{
          isCanCreateProposals: true,
          isCanCreatePolicyProposals: true,
        }}
      />
    );

    expect(getByText(daoDescription)).toBeTruthy();
  });
});
