import React, { ReactNode, useCallback } from 'react';
import { useAsyncFn } from 'react-use';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';

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
import { ExternalLink } from 'components/ExternalLink';
import { Icon, IconName } from 'components/Icon';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { SputnikNearService } from 'services/sputnik';
import { getProposalVariantLabel } from 'astro_2.0/features/ViewProposal/helpers';
import { ExplorerLink } from 'components/ExplorerLink';

import { Button } from 'components/button/Button';

import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import { DEFAULT_VOTE_GAS } from 'services/sputnik/constants';
import { gasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { useCountdown } from 'hooks/useCountdown';
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
  daoId: string;
  proposalId: number;
  accountId: string;
  likes: number;
  dislikes: number;
  voteRemove: number;
  voteStatus: string;
  isFinalized: boolean;
  liked: boolean;
  disliked: boolean;
  dismissed: boolean;
  voteDetails?: VoteDetail;
  content: ReactNode;
  votePeriodEnd: string;
  updatedAt?: string | null;
  toggleInfoPanel?: () => void;
  commentsCount: number;
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    isCouncil: boolean;
  };
}

function getTimestampLabel(
  timeLeft: string | null | undefined,
  status: ProposalStatus,
  updatedAt?: string | null,
  votingEndDate?: string | null
) {
  if (status === 'InProgress') {
    if (timeLeft) {
      return `${timeLeft} left`;
    }

    return <span className={styles.errorLabel}>Time expired</span>;
  }

  if (status === 'Expired' && votingEndDate) {
    return (
      <div className={cn(styles.timestampLabel)}>
        <span className={cn(styles.label)}>{status} at&nbsp;</span>
        <span className={cn(styles.value)}>
          {format(parseISO(votingEndDate as string), 'dd MMMM yyyy')}
        </span>
      </div>
    );
  }

  if ((status === 'Approved' || status === 'Rejected') && updatedAt) {
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

function getSealIcon(status: ProposalStatus): string | null {
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

  return sealIcon;
}

const schema = yup.object().shape({
  gas: gasValidation,
});

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
  voteStatus,
  isFinalized,
  likes,
  dislikes,
  liked,
  disliked,
  dismissed,
  voteRemove,
  voteDetails,
  content,
  daoId,
  permissions,
  updatedAt,
  toggleInfoPanel,
  commentsCount,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [{ loading: voteLoading }, voteClickHandler] = useAsyncFn(
    async (vote: VoteAction, gas?: string | number) => {
      await SputnikNearService.vote(daoId, proposalId, vote, gas);
      await router.reload();
    },
    [daoId, proposalId, router]
  );

  const [
    { loading: finalizeLoading },
    finalizeClickHandler,
  ] = useAsyncFn(async () => {
    await SputnikNearService.finalize(daoId, proposalId);
    await router.reload();
  }, [daoId, proposalId, router]);

  const handleCardClick = useCallback(() => {
    if (id && router.pathname !== SINGLE_PROPOSAL_PAGE_URL) {
      router.push({
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: id,
        },
      });
    }
  }, [daoId, id, router]);

  const timeLeft = useCountdown(votePeriodEnd);

  const sealIcon = timeLeft !== undefined ? getSealIcon(status) : null;
  const showFinalize =
    permissions.canApprove &&
    permissions.canReject &&
    permissions.canDelete &&
    ((voteStatus === 'Expired' && !isFinalized) ||
      (voteStatus === 'Active' &&
        timeLeft === null &&
        status === 'InProgress'));

  const methods = useForm<DAOFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      gas: DEFAULT_VOTE_GAS,
    },
    resolver: yupResolver(schema),
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      data-testid="proposal-card-root"
      className={cn(styles.root, {
        [styles.clickable]: !!id,
      })}
      onClick={handleCardClick}
    >
      {sealIcon && !showFinalize && (
        <div className={styles.proposalStatusSeal}>
          <Icon name={sealIcon as IconName} />
        </div>
      )}
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          valueFontSize="L"
          label={`${t(`proposalCard.proposalType`)}${type}`}
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
        {getTimestampLabel(timeLeft, status, updatedAt, votePeriodEnd)}
        {showFinalize && (
          <Button
            size="small"
            disabled={finalizeLoading}
            className={styles.finalizeButton}
            onClick={e => {
              e.stopPropagation();

              return finalizeClickHandler();
            }}
          >
            Finalize
          </Button>
        )}
      </div>
      <div className={styles.proposerCell}>
        <InfoBlockWidget
          label={t(`proposalCard.proposalOwner`)}
          value={proposer}
        />
      </div>
      <div className={styles.descriptionCell}>
        <FieldWrapper label={t(`proposalCard.proposalDescription`)} fullWidth>
          <div className={styles.proposalDescription}>{description}</div>
        </FieldWrapper>

        <div className={styles.proposalExternalLink}>
          <ExternalLink to={link} />
        </div>
      </div>
      <div className={styles.contentCell}>{content}</div>
      <div className={styles.voteControlCell}>
        <FormProvider {...methods}>
          <ProposalControlPanel
            status={status}
            onLike={(data, e) => {
              e?.stopPropagation();

              return voteClickHandler('VoteApprove', data.gas);
            }}
            onDislike={(data, e) => {
              e?.stopPropagation();

              return voteClickHandler('VoteReject', data.gas);
            }}
            disableControls={voteLoading || !timeLeft || finalizeLoading}
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
        </FormProvider>
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
          disableControls={voteLoading || !timeLeft || finalizeLoading}
          removed={dismissed}
          removeCount={voteRemove}
          proposalVariant={variant}
          proposalType={type}
          permissions={permissions}
          proposalDescription={description}
          daoId={daoId}
          proposalId={id}
        />
      </div>
    </div>
  );
};
