import React, { ReactNode, useCallback } from 'react';
import { useAsyncFn } from 'react-use';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import {
  ProposalStatus,
  ProposalType,
  ProposalVariant,
  VoteAction,
} from 'types/proposal';
import { ProgressBar } from 'components/VoteDetails/components/progress-bar/ProgressBar';
import { VoteDetail } from 'features/types';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { ProposalActions } from 'features/proposal/components/ProposalActions';
import { DAO } from 'types/dao';
import { ExternalLink } from 'components/ExternalLink';
import { Icon, IconName } from 'components/Icon';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { SputnikNearService } from 'services/sputnik';
import { getProposalVariantLabel } from 'astro_2.0/features/ViewProposal/helpers';
import { ExplorerLink } from 'components/ExplorerLink';
import { useCountdown } from 'hooks/useCountdown';

import { useGetVotePermissions } from './hooks/useGetVotePermissions';
import { ProposalControlPanel } from './components/ProposalControlPanel';

import styles from './ProposalCard.module.scss';

export interface ProposalCardProps {
  id?: string;
  type: ProposalType;
  variant: ProposalVariant;
  status: ProposalStatus;
  proposer: string;
  description: string;
  link: string;
  proposalTxHash: string;
  dao: DAO;
  proposalId: number;
  accountId: string;
  likes: number;
  dislikes: number;
  voteRemove: number;
  liked: boolean;
  disliked: boolean;
  dismissed: boolean;
  voteDetails?: VoteDetail;
  content: ReactNode;
  votePeriodEnd: string;
  updatedAt?: string | null;
  toggleInfoPanel?: () => void;
  commentsCount: number;
}

function getTimestampLabel(
  timeLeft: string | null | undefined,
  status: ProposalStatus,
  updatedAt?: string | null
) {
  if (status === 'InProgress') {
    if (timeLeft) {
      return `${timeLeft} left`;
    }

    return 'Voting ended';
  }

  if (
    (status === 'Approved' || status === 'Rejected' || status === 'Expired') &&
    updatedAt
  ) {
    return (
      <div className={cn(styles.timestampLabel)}>
        <span
          className={cn(styles.label, {
            [styles.approved]: status === 'Approved',
            [styles.rejected]: status === 'Rejected',
          })}
        >
          {status} at&nbsp;
        </span>
        <span className={cn(styles.value)}>
          {format(parseISO(updatedAt as string), 'dd MMMM yyyy')}
        </span>
      </div>
    );
  }

  return 'Voting ended';
}

function getSealIcon(
  status: ProposalStatus,
  timeLeft: string | null
): string | null {
  let sealIcon;

  switch (status) {
    case 'Approved': {
      sealIcon = 'sealApproved';
      break;
    }
    case 'Expired':
    case 'Moved':
    case 'Rejected':
    case 'Removed': {
      sealIcon = 'sealFailed';
      break;
    }
    case 'InProgress':
    default: {
      sealIcon = null;
    }
  }

  return !timeLeft && !sealIcon ? 'sealFailed' : sealIcon;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  id,
  type,
  variant,
  proposalTxHash,
  proposer,
  description,
  link,
  status,
  proposalId,
  votePeriodEnd,
  likes,
  dislikes,
  liked,
  disliked,
  dismissed,
  voteRemove,
  voteDetails,
  content,
  accountId,
  dao,
  updatedAt,
  toggleInfoPanel,
  commentsCount,
}) => {
  const router = useRouter();
  const permissions = useGetVotePermissions(dao, type, accountId);

  const [{ loading: voteLoading }, voteClickHandler] = useAsyncFn(
    async (vote: VoteAction) => {
      await SputnikNearService.vote(dao.id, proposalId, vote);
      await router.replace(router.asPath);
    },
    [dao, proposalId, router]
  );

  const handleCardClick = useCallback(() => {
    if (id) {
      router.push({
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: dao.id,
          proposal: id,
        },
      });
    }
  }, [dao.id, id, router]);

  const timeLeft = useCountdown(votePeriodEnd);

  const sealIcon =
    timeLeft !== undefined ? getSealIcon(status, timeLeft) : null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={cn(styles.root, {
        [styles.clickable]: !!id,
      })}
      onClick={handleCardClick}
    >
      {sealIcon && (
        <div className={styles.proposalStatusSeal}>
          <Icon name={sealIcon as IconName} />
        </div>
      )}
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          valueFontSize="L"
          label={`Proposal type: ${type}`}
          value={
            <div className={styles.proposalType}>
              {getProposalVariantLabel(variant, type)}
              <ExplorerLink
                linkData={proposalTxHash}
                linkType="transaction"
                className={styles.proposalWalletLink}
              />
            </div>
          }
        />
      </div>
      <div className={styles.countdownCell}>
        {getTimestampLabel(timeLeft, status, updatedAt)}
      </div>
      <div className={styles.proposerCell}>
        <InfoBlockWidget label="Proposer" value={proposer} />
      </div>
      <div className={styles.descriptionCell}>
        <FieldWrapper label="Description" fullWidth>
          <div className={styles.proposalDescription}>{description}</div>
        </FieldWrapper>

        <div className={styles.proposalExternalLink}>
          <ExternalLink to={link} />
        </div>
      </div>
      <div className={styles.contentCell}>{content}</div>
      <div className={styles.voteControlCell}>
        <ProposalControlPanel
          status={status}
          onLike={e => {
            e.stopPropagation();

            voteClickHandler('VoteApprove');
          }}
          onDislike={e => {
            e.stopPropagation();

            voteClickHandler('VoteReject');
          }}
          disableControls={voteLoading || !timeLeft}
          likes={likes}
          liked={liked}
          dislikes={dislikes}
          disliked={disliked}
          permissions={permissions}
          commentsCount={commentsCount}
          toggleInfoPanel={e => {
            e.stopPropagation();

            if (toggleInfoPanel) {
              toggleInfoPanel();
            }
          }}
        />
      </div>
      <div className={styles.voteProgress}>
        {voteDetails && <ProgressBar detail={voteDetails} />}
      </div>
      <div className={styles.actionBar}>
        <ProposalActions
          onRemove={e => {
            e.stopPropagation();

            if (permissions.canDelete) {
              voteClickHandler('VoteRemove');
            }
          }}
          removed={dismissed}
          removeCount={voteRemove}
          proposalVariant={variant}
          proposalType={type}
          proposalDescription={description}
          daoId={dao.id}
          proposalId={id}
        />
      </div>
    </div>
  );
};
