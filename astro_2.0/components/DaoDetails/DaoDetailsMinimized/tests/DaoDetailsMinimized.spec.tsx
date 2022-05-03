/* eslint-disable @typescript-eslint/ban-ts-comment */
import last from 'lodash/last';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { useWalletContext } from 'context/WalletContext';

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
    useWalletContext: jest.fn(() => ({})),
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

  it.each`
    button          | url
    ${'.proposals'} | ${`/dao/${daoMock.id}/proposals`}
    ${'.funds'}     | ${`/dao/${daoMock.id}/treasury/tokens`}
    ${'.members'}   | ${`/dao/${daoMock.id}/groups/all`}
    ${'.settings'}  | ${`/dao/${daoMock.id}/governance/settings`}
    ${'.nfts'}      | ${`/dao/${daoMock.id}/treasury/nfts`}
    ${'.bounties'}  | ${`/dao/${daoMock.id}/tasks/bounties/list`}
    ${'.polls'}     | ${`/dao/${daoMock.id}/tasks/polls`}
  `(
    'Should navigate to proper url when user click "$button" action button',
    ({ button, url }) => {
      const router = {
        push: jest.fn(),
        asPath: '',
      };

      // @ts-ignore
      useRouter.mockImplementation(() => router);

      const { getByText } = render(
        <DaoDetailsMinimized dao={daoMock} userPermissions={permissions} />
      );

      const actionButton = getByText(button, { exact: false });

      fireEvent.click(actionButton);

      expect(router.push).toBeCalledWith(url);
    }
  );

  it('Should not redirect user if he is on the page where action button redirects', () => {
    const router = {
      push: jest.fn(),
      asPath: `/dao/${daoMock.id}/proposals`,
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const { getByText } = render(
      <DaoDetailsMinimized dao={daoMock} userPermissions={permissions} />
    );

    const actionButton = getByText('.proposals', { exact: false });

    fireEvent.click(actionButton);

    expect(router.push).not.toBeCalled();
  });

  it('Should redirect user to login page on proposal click attempt if not logged', () => {
    const login = jest.fn();

    // @ts-ignore
    useWalletContext.mockImplementation(() => ({ login }));

    const { getAllByRole } = render(
      <DaoDetailsMinimized
        dao={daoMock}
        userPermissions={permissions}
        onCreateProposalClick={() => 0}
      />
    );

    fireEvent.click(last(getAllByRole('button')) as Element);

    expect(login).toBeCalled();
  });

  it('Should call onCreateProposalClick on proposal click', () => {
    const onCreateProposalClick = jest.fn();

    // @ts-ignore
    useWalletContext.mockImplementation(() => ({ accountId: '123' }));

    const { getAllByRole } = render(
      <DaoDetailsMinimized
        dao={daoMock}
        userPermissions={permissions}
        onCreateProposalClick={onCreateProposalClick}
      />
    );

    fireEvent.click(last(getAllByRole('button')) as Element);

    expect(onCreateProposalClick).toBeCalled();
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
