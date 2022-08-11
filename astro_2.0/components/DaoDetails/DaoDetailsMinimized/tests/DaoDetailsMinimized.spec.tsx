/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render, screen } from '@testing-library/react';

import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails/DaoDetailsMinimized';

import { ProposalType } from 'types/proposal';

import { daoMock } from './mock';

jest.mock('react-text-truncate', () => {
  return () => <div />;
});

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(() => ({
      asPath: '',
    })),
  };
});

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(),
  };
});

jest.mock('context/WalletContext', () => {
  return {
    useWalletContext: jest.fn(() => ({
      accountId: 'jasonborn.near',
    })),
  };
});

jest.mock('context/DaoSettingsContext', () => {
  return {
    useDaoSettings: jest
      .fn()
      .mockReturnValue({ settings: {}, update: jest.fn(), loading: false }),
  };
});

describe('dao details minimized', () => {
  const permissions = {
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

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Should render component', () => {
    const { container } = render(
      <DaoDetailsMinimized dao={daoMock} userPermissions={permissions} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render action section if onCreateProposalClick provided and user has proper permission', () => {
    render(
      <DaoDetailsMinimized
        dao={daoMock}
        userPermissions={permissions}
        onCreateProposalClick={() => 0}
      />
    );

    expect(screen.getByTestId('createProposal')).toBeInTheDocument();
    expect(screen.getByTestId('createProposal')).toBeVisible();
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
