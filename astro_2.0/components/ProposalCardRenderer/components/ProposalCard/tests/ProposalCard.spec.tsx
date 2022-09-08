/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { VoteDetail } from 'features/types';
import { ProposalType, ProposalVariant } from 'types/proposal';

import {
  ProposalCard,
  ProposalCardProps,
} from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard';
import { fireEvent } from '@testing-library/dom';

import { useCountdown } from 'hooks/useCountdown';

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

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

jest.mock('components/VoteDetails/components/progress-bar/ProgressBar', () => ({
  ProgressBar: ({ detail }: { detail: VoteDetail }) => (
    <div>{detail.label}</div>
  ),
}));

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

jest.mock('hooks/useCountdown', () => ({
  useCountdown: jest.fn(),
}));

jest.mock('react-hook-form', () => {
  return {
    ...jest.requireActual('react-hook-form'),
    useFormContext: jest.fn(() => ({
      formState: { errors: {} },
      handleSubmit: jest.fn().mockReturnValue(jest.fn()),
      watch: () => 0,
      setValue: () => 0,
      register: () => 0,
    })),
    useForm: jest.fn(() => ({
      setValue: () => 0,
      getValues: (key: string) => {
        if (!key) {
          return 0;
        }

        return [];
      },
      formState: {
        touchedFields: {},
      },
      register: () => 0,
      handleSubmit: jest.fn().mockReturnValue(jest.fn()),
    })),
  };
});

describe('Proposal Card', () => {
  function renderProposalCard(props?: Partial<ProposalCardProps>) {
    return render(
      <ProposalCard
        type={ProposalType.Vote}
        variant={ProposalVariant.ProposePoll}
        status="InProgress"
        proposer="proposer"
        description="description"
        link="link"
        proposalTxHash="proposalTxHash"
        daoId="daoId"
        proposalId={123}
        accountId="accountId"
        likes={0}
        dislikes={0}
        voteRemove={0}
        voteStatus="InProgress"
        isFinalized={false}
        liked={false}
        disliked={false}
        dismissed={false}
        content={<div>Content</div>}
        votePeriodEnd="2016-12-12"
        commentsCount={0}
        permissions={{
          canApprove: true,
          canReject: true,
          canDelete: true,
          isCouncil: true,
        }}
        {...props}
      />
    );
  }

  it('Should render "Finalize" button', () => {
    const { getAllByText } = renderProposalCard({
      voteStatus: 'Expired',
    });

    expect(getAllByText('proposalCard.finalize')).toHaveLength(1);
  });

  it.each`
    status        | icon
    ${'Approved'} | ${'sealApproved'}
    ${'Expired'}  | ${'sealFailed'}
    ${'Moved'}    | ${'sealFailed'}
    ${'Rejected'} | ${'sealFailed'}
    ${'Removed'}  | ${'sealFailed'}
  `('Should render $icon for $status status', ({ status, icon }) => {
    // @ts-ignore
    useCountdown.mockImplementation(() => '123');

    const { getAllByText } = renderProposalCard({
      votePeriodEnd: '3016-12-12',
      status,
    });

    expect(getAllByText(icon)).toHaveLength(1);
  });

  it('Should navigate to proposal page when clicked', () => {
    const id = '123456';
    const daoId = 'daoId123';

    const router = {
      push: jest.fn(),
    };

    // @ts-ignore
    useRouter.mockImplementation(() => router);

    const component = renderProposalCard({ id, daoId });

    fireEvent.mouseDown(component.getByTestId('proposal-card-root'));

    expect(router.push).toBeCalledWith({
      pathname: SINGLE_PROPOSAL_PAGE_URL,
      query: {
        dao: daoId,
        proposal: id,
      },
    });
  });

  it('Should render proper timestamp when status InProgress and time left', () => {
    // @ts-ignore
    useCountdown.mockImplementation(() => '123');

    const { getAllByText } = renderProposalCard({
      votePeriodEnd: '3016-12-12',
    });

    expect(getAllByText('123 proposalCard.timeLeft')).toHaveLength(1);
  });

  it('Should render proper timestamp when status Approved', () => {
    // @ts-ignore
    useCountdown.mockImplementation(() => '123');

    const { getAllByText } = renderProposalCard({
      status: 'Approved',
      updatedAt: '3016-12-12',
    });

    expect(getAllByText('12 December 3016')).toHaveLength(1);
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
