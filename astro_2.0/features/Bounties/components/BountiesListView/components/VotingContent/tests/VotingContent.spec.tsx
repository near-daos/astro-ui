/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/dom';

import { DAO } from 'types/dao';
import { BountyProposal } from 'types/bounties';

import { render } from 'jest/testUtils';

import { VotingContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/VotingContent';
import { useBountyVoting } from 'astro_2.0/features/Bounties/components/hooks';

jest.mock('astro_2.0/features/Bounties/components/hooks', () => {
  return {
    useBountyVoting: jest.fn(() => ({})),
  };
});

jest.mock('hooks/useCountdown', () => {
  return {
    useCountdown: () => '123',
  };
});

jest.mock('services/sputnik/mappers', () => {
  return {
    getVotesStatistic: () => ({
      votes: {},
    }),
  };
});

describe('UnclaimCompleteContent', () => {
  const dao = {} as unknown as DAO;
  const proposal = {
    permissions: {
      canApprove: true,
      canReject: true,
    },
  } as unknown as BountyProposal;

  it('Should render component', () => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockImplementationOnce(() => '123456');

    const { container } = render(
      <VotingContent proposal={proposal} accountId="accountId" daoId={dao.id} />
    );

    expect(container).toMatchSnapshot();
  });

  it.each`
    type         | index | action
    ${'approve'} | ${0}  | ${'VoteApprove'}
    ${'reject'}  | ${1}  | ${'VoteReject'}
  `('Should properly handle vote $type', ({ index, action }) => {
    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockImplementationOnce(() => '123456');

    const handleVote = jest.fn();

    // @ts-ignore
    useBountyVoting.mockImplementation(() => ({
      handleVote,
    }));

    const { queryAllByRole } = render(
      <VotingContent proposal={proposal} accountId="accountId" daoId={dao.id} />
    );

    const buttons = queryAllByRole('button');

    fireEvent.click(buttons[index]);

    expect(handleVote).toBeCalledWith(action);
  });
});
