import { render } from 'jest/testUtils';

import { DaoDashboardHeader } from 'astro_2.0/features/DaoDashboardHeader';

import { ProposalType } from 'types/proposal';

import { dao, daoDescription } from './mocks';

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(),
  };
});

jest.mock('astro_2.0/features/DaoDashboardHeader/hooks/useJoinDao', () => {
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

jest.mock('context/DaoTokensContext', () => {
  return {
    useDaoCustomTokens: jest.fn().mockReturnValue({ tokens: {} }),
  };
});

jest.mock('context/DaoSettingsContext', () => {
  return {
    useDaoSettings: jest
      .fn()
      .mockReturnValue({ settings: {}, update: jest.fn(), loading: false }),
  };
});

const userPermissions = {
  isCanCreateProposals: true,
  isCanCreatePolicyProposals: true,
  allowedProposalsToCreate: {
    [ProposalType.ChangePolicy]: true,
    [ProposalType.ChangeConfig]: true,
    [ProposalType.AddBounty]: true,
    [ProposalType.Transfer]: true,
    [ProposalType.Vote]: true,
    [ProposalType.RemoveMemberFromRole]: true,
    [ProposalType.AddMemberToRole]: true,
    [ProposalType.AddMemberToRole]: true,
    [ProposalType.FunctionCall]: true,
    [ProposalType.UpgradeRemote]: true,
    [ProposalType.UpgradeSelf]: true,
    [ProposalType.SetStakingContract]: true,
    [ProposalType.BountyDone]: true,
  },
  allowedProposalsToVote: {
    [ProposalType.ChangePolicy]: true,
    [ProposalType.ChangeConfig]: true,
    [ProposalType.AddBounty]: true,
    [ProposalType.Transfer]: true,
    [ProposalType.Vote]: true,
    [ProposalType.RemoveMemberFromRole]: true,
    [ProposalType.AddMemberToRole]: true,
    [ProposalType.AddMemberToRole]: true,
    [ProposalType.FunctionCall]: true,
    [ProposalType.UpgradeRemote]: true,
    [ProposalType.UpgradeSelf]: true,
    [ProposalType.SetStakingContract]: true,
    [ProposalType.BountyDone]: true,
  },
};

describe('DaoDashboardHeader', () => {
  it('Should render component', () => {
    const { getByText } = render(
      <DaoDashboardHeader
        dao={dao}
        onCreateProposal={() => 0}
        userPermissions={userPermissions}
      />
    );

    expect(getByText(daoDescription)).toBeTruthy();
  });
});
