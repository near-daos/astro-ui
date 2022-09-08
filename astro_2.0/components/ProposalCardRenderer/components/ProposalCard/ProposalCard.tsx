import React, { ReactNode, useCallback } from 'react';
import { useAsyncFn, useLocalStorage, useLocation } from 'react-use';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import { TFunction } from 'react-i18next';
import Link from 'next/link';
import Tooltip from 'react-tooltip';

import {
  SINGLE_PROPOSAL_PAGE_URL,
  EDIT_DRAFT_PAGE_URL,
} from 'constants/routing';

import { useWalletContext } from 'context/WalletContext';

import {
  ProposalFeedItem,
  ProposalStatus,
  ProposalType,
  ProposalVariant,
  VoteAction,
} from 'types/proposal';
import { VoteDetail } from 'features/types';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { ProposalActions } from 'features/proposal/components/ProposalActions';
import { ExternalLink } from 'components/ExternalLink';
import { Icon, IconName } from 'components/Icon';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { getProposalVariantLabel } from 'astro_2.0/features/ViewProposal/helpers';
import { ExplorerLink } from 'components/ExplorerLink';
import { AmountBalanceCard } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/AmountBalanceCard';
import { HistorySelector } from 'astro_2.0/features/ViewProposal/components/HistorySelector';

import { Button } from 'components/button/Button';

import { GA_EVENTS, sendGAEvent } from 'utils/ga';
import { DAOFormValues } from 'astro_2.0/features/CreateDao/components/types';
import {
  DEFAULT_UPGRADE_DAO_VOTE_GAS,
  DEFAULT_VOTE_GAS,
} from 'services/sputnik/constants';
import { VOTE_ACTION_SOURCE_PAGE } from 'constants/votingConstants';
import { getGasValidation } from 'astro_2.0/features/CreateProposal/helpers';
import { useCountdown } from 'hooks/useCountdown';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { DraftDescription } from 'astro_2.0/components/ProposalCardRenderer/components/DraftDescription';
import { DraftInfo } from 'astro_2.0/components/ProposalCardRenderer/components/DraftInfo';
import { DraftManagement } from 'astro_2.0/components/ProposalCardRenderer/components/DraftManagement';
import { ProposalControlPanel } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard/components/ProposalControlPanel';
import { DAO } from 'types/dao';

import { UserPermissions } from 'types/context';

import { formatISODate } from 'utils/format';
import styles from './ProposalCard.module.scss';

export interface ProposalCardProps {
  id?: string;
  type: ProposalType;
  variant: ProposalVariant;
  status: ProposalStatus;
  preventNavigate?: boolean;
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
  optionalPostVoteAction?: () => Promise<void>;
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    isCouncil: boolean;
  };
  isDraft?: boolean;
  title?: string;
  isSaved?: boolean;
  history?: ProposalFeedItem[];
  onSelect?: (p: string) => void;
  selectedList?: string[];
  convertToProposal?: () => void;
  saves?: number;
  dao?: DAO;
  draftState?: string;
  userPermissions?: UserPermissions;
}

function getTimestampLabel(
  t: TFunction,
  timeLeft: string | null | undefined,
  status: ProposalStatus,
  updatedAt?: string | null,
  votingEndDate?: string | null,
  isDraft?: boolean
) {
  if (isDraft) {
    return `${t('proposalCard.created')} ${timeLeft}`;
  }

  if (status === 'InProgress') {
    if (timeLeft) {
      return `${timeLeft} ${t('proposalCard.timeLeft')}`;
    }

    return <span className={styles.errorLabel}>Time expired</span>;
  }

  if (status === 'Expired' && votingEndDate) {
    return (
      <div className={cn(styles.timestampLabel)}>
        <span className={cn(styles.label)}>{status} at&nbsp;</span>
        <span className={cn(styles.value)}>
          {formatISODate(votingEndDate, 'dd MMMM yyyy')}
        </span>
      </div>
    );
  }

  if (
    (status === 'Approved' || status === 'Rejected' || status === 'Failed') &&
    updatedAt
  ) {
    return (
      <div className={cn(styles.timestampLabel)}>
        <span
          className={cn(styles.label, {
            [styles.approved]: status === 'Approved',
            [styles.rejected]: status === 'Rejected' || status === 'Failed',
          })}
        >
          {status} at&nbsp;
        </span>
        <span className={cn(styles.value)}>
          {formatISODate(updatedAt, 'dd MMMM yyyy')}
        </span>
      </div>
    );
  }

  return t('proposalCard.votingEnded');
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
    case 'Failed':
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

export const ProposalCard: React.FC<ProposalCardProps> = ({
  id,
  type,
  variant,
  proposalTxHash,
  proposer,
  preventNavigate,
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
  content,
  daoId,
  permissions,
  updatedAt,
  toggleInfoPanel,
  commentsCount,
  optionalPostVoteAction,
  isDraft,
  title,
  isSaved,
  history,
  onSelect,
  selectedList,
  convertToProposal,
  saves,
  dao,
  draftState,
  userPermissions,
}) => {
  const { accountId, nearService } = useWalletContext();
  const { t } = useTranslation();
  const router = useRouter();
  const [, setVoteActionSource] = useLocalStorage(VOTE_ACTION_SOURCE_PAGE);
  const { pathname } = useLocation();

  const isDraftClosed = draftState === 'closed';

  const schema = yup.object().shape({
    gas: getGasValidation(t),
  });

  const [{ loading: voteLoading }, voteClickHandler] = useAsyncFn(
    async (vote: VoteAction, gas?: string | number) => {
      try {
        setVoteActionSource(pathname);

        const res = await nearService?.vote(daoId, proposalId, vote, gas);

        sendGAEvent({
          name: GA_EVENTS.ACT_PROPOSAL,
          daoId,
          accountId,
          params: {
            voteAction: vote,
            proposalId,
          },
        });

        // One of the usages - in upgrade dao wizard to auto update steps
        if (optionalPostVoteAction) {
          if (res && res[0]) {
            const successReceipt =
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res[0]?.transaction_outcome?.outcome?.status?.SuccessReceiptId;

            if (successReceipt) {
              await optionalPostVoteAction();
            }
          }
        }

        await router.reload();
      } catch (e) {
        // todo - handle errors
        await router.reload();
        // showNotification({
        //   type: NOTIFICATION_TYPES.ERROR,
        //   description: e.message,
        //   lifetime: 20000,
        // });
      }
    },
    [daoId, proposalId, router, nearService, pathname]
  );

  const [{ loading: finalizeLoading }, finalizeClickHandler] =
    useAsyncFn(async () => {
      await nearService?.finalize(daoId, proposalId);
      await router.reload();
    }, [daoId, proposalId, router, nearService]);

  const handleCardClick = useCallback(
    e => {
      if (
        preventNavigate ||
        e?.target?.closest(`.${styles.voteControlCell}`) ||
        e?.target?.closest(`.${styles.actionBar}`)
      ) {
        return;
      }

      if (selectedList?.length !== 0 && onSelect && id !== undefined) {
        onSelect(id);

        return;
      }

      if (id && router.pathname !== SINGLE_PROPOSAL_PAGE_URL) {
        router.push({
          pathname: SINGLE_PROPOSAL_PAGE_URL,
          query: {
            dao: daoId,
            proposal: id,
          },
        });
      }
    },
    [daoId, id, onSelect, preventNavigate, router, selectedList?.length]
  );

  const timeLeft = useCountdown(votePeriodEnd);

  const sealIcon = timeLeft !== undefined ? getSealIcon(status) : null;
  const isProposalExpired =
    (voteStatus === 'Expired' && !isFinalized) ||
    (voteStatus === 'Active' && timeLeft === null && status === 'InProgress');
  const userCanFinalize =
    variant !== ProposalVariant.ProposeDoneBounty ||
    (variant === ProposalVariant.ProposeDoneBounty && proposer === accountId);

  const restrictProposalRemove = variant === ProposalVariant.ProposeDoneBounty;

  const showFinalize =
    permissions.canApprove &&
    permissions.canReject &&
    permissions.canDelete &&
    isProposalExpired &&
    userCanFinalize;

  const { canApprove, canReject } = permissions;

  const methods = useForm<DAOFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      gas:
        variant === ProposalVariant.ProposeGetUpgradeCode ||
        variant === ProposalVariant.ProposeRemoveUpgradeCode ||
        variant === ProposalVariant.ProposeUpgradeSelf ||
        variant === ProposalVariant.ProposeCreateDao ||
        variant === ProposalVariant.ProposeStakingContractDeployment
          ? DEFAULT_UPGRADE_DAO_VOTE_GAS
          : DEFAULT_VOTE_GAS,
    },
    resolver: yupResolver(schema),
  });

  function renderProposer() {
    switch (variant) {
      case ProposalVariant.ProposeStakingContractDeployment:
      case ProposalVariant.ProposeCreateToken: {
        return null;
      }
      case ProposalVariant.ProposeTokenDistribution: {
        return (
          <div className={styles.proposerCell}>
            <InfoBlockWidget
              label={t('proposalCard.proposalOwner')}
              value={proposer}
            />
            <AmountBalanceCard
              value={23000}
              suffix="REF"
              className={styles.amountBalance}
            />
          </div>
        );
      }
      default: {
        return (
          <div className={styles.proposerCell}>
            <InfoBlockWidget
              label={t(`proposalCard.proposalOwner`)}
              value={proposer}
            />
          </div>
        );
      }
    }
  }

  function renderDescription() {
    switch (variant) {
      case ProposalVariant.ProposeCreateToken:
      case ProposalVariant.ProposeStakingContractDeployment:
      case ProposalVariant.ProposeTokenDistribution: {
        return null;
      }
      default: {
        return (
          <div className={styles.descriptionCell}>
            <FieldWrapper
              label={t(`proposalCard.proposalDescription`)}
              fullWidth
            >
              <div className={styles.proposalDescription}>{description}</div>
            </FieldWrapper>

            <div className={styles.proposalExternalLink}>
              <ExternalLink to={link} />
            </div>
          </div>
        );
      }
    }
  }

  const handleEditDraft = useCallback(() => {
    router.push({
      pathname: EDIT_DRAFT_PAGE_URL,
      query: {
        dao: daoId,
        draft: id || '',
      },
    });
  }, [daoId, id, router]);

  function renderLinkToProposal() {
    if (!isDraftClosed) {
      return null;
    }

    return (
      <InfoBlockWidget
        className={styles.createdProposal}
        label="Link to proposal"
        value={
          <Link
            passHref
            href={{
              pathname: SINGLE_PROPOSAL_PAGE_URL,
              query: {
                dao: daoId,
                proposal: `${daoId}-${proposalId}`,
              },
            }}
          >
            <a className={styles.createdProposalLink}>
              <Icon name="buttonLink" className={styles.createdProposalIcon} />
              Proposal link
            </a>
          </Link>
        }
      />
    );
  }

  function renderCardContent() {
    if (isDraft) {
      return (
        <>
          {renderProposer()}
          {renderLinkToProposal()}
          <div className={styles.draftContent}>
            <div className={styles.draftTitle}>{title}</div>
            <DraftDescription description={description} />
          </div>
          <div className={styles.contentCell}>{content}</div>
        </>
      );
    }

    switch (variant) {
      case ProposalVariant.ProposeChangeProposalVotingPermissions:
      case ProposalVariant.ProposeChangeProposalCreationPermissions: {
        return (
          <>
            {renderProposer()}
            <div className={styles.descriptionCell}>
              <FieldWrapper
                label={t(`proposalCard.proposalDescription`)}
                fullWidth
              >
                <div className={styles.proposalDescription}>{description}</div>
              </FieldWrapper>

              <div className={styles.proposalExternalLink}>
                <ExternalLink to={link} />
              </div>
              <div className={styles.customContent}>{content}</div>
            </div>
          </>
        );
      }
      case ProposalVariant.ProposeUpdateGroup: {
        return (
          <>
            {renderProposer()}
            {renderDescription()}
            <div className={styles.proposalGroupCell}>{content}</div>
          </>
        );
      }
      case ProposalVariant.ProposeStakingContractDeployment:
      case ProposalVariant.ProposeTokenDistribution: {
        return <div className={styles.descriptionCell}>{content}</div>;
      }
      default: {
        return (
          <>
            {renderProposer()}
            {renderDescription()}
            <div className={styles.proposalGroupCell} />
            <div className={styles.contentCell}>{content}</div>
            <Tooltip effect="solid" />
          </>
        );
      }
    }
  }

  const getInfoBlockWidgetLabel = () => {
    return isDraft
      ? t('proposalCard.draft')
      : `${t(`proposalCard.proposalType`)}${type}`;
  };

  const renderBottomContent = () => {
    if (isDraft) {
      return (
        <div className={styles.draftFooter}>
          <DraftManagement
            state={draftState}
            accountId={accountId}
            proposer={proposer}
            convertToProposal={convertToProposal}
            onEditDraft={handleEditDraft}
            dao={dao}
            userPermissions={userPermissions}
            proposalType={type}
          />
          <DraftInfo dao={dao} saves={saves || 0} isSaved={Boolean(isSaved)} />
        </div>
      );
    }

    return (
      <>
        <div
          tabIndex={-1}
          role="button"
          className={styles.voteControlCell}
          onClick={e => e.stopPropagation()}
          onKeyPress={e => e.stopPropagation()}
        >
          <FormProvider {...methods}>
            <ProposalControlPanel
              status={status}
              variant={variant}
              onLike={(data, e) => {
                e?.stopPropagation();

                return voteClickHandler('VoteApprove', data.gas);
              }}
              onDislike={(data, e) => {
                e?.stopPropagation();

                return voteClickHandler('VoteReject', data.gas);
              }}
              disableControls={
                voteLoading || !timeLeft || finalizeLoading || !accountId
              }
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

        <div className={styles.actionBar}>
          <ProposalActions
            allowSelect={
              status === 'InProgress' &&
              voteStatus === 'Active' &&
              !liked &&
              !disliked &&
              canApprove &&
              canReject &&
              !!accountId
            }
            onSelect={onSelect}
            selectedList={selectedList}
            onRemove={e => {
              e.stopPropagation();

              if (permissions.canDelete) {
                voteClickHandler('VoteRemove');
              }
            }}
            disableControls={
              voteLoading ||
              !timeLeft ||
              finalizeLoading ||
              !userCanFinalize ||
              restrictProposalRemove
            }
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
      </>
    );
  };

  function renderTimestampCell() {
    if (!isDraft) {
      return (
        <div className={styles.countdownCell}>
          {getTimestampLabel(
            t,
            timeLeft,
            status,
            updatedAt,
            votePeriodEnd,
            isDraft
          )}
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
              {t('proposalCard.finalize')}
            </Button>
          )}
        </div>
      );
    }

    if (isDraftClosed) {
      return (
        <div className={styles.countdownCell}>
          <span>
            <span className={styles.convertedDraftCountdownTitle}>
              Converted
            </span>{' '}
            {formatISODate(updatedAt, 'dd MMMM yyyy, HH:mm')}
          </span>
        </div>
      );
    }

    if (history && history.length >= 2) {
      return (
        <div className={styles.countdownCell}>
          <HistorySelector data={history} />
        </div>
      );
    }

    return (
      <div className={styles.countdownCell}>
        {formatISODate(updatedAt, 'dd MMMM yyyy, HH:mm')}
      </div>
    );
  }

  const renderStatusSeal = () => {
    if (isDraftClosed) {
      return (
        <div className={cn(styles.proposalStatusSeal, styles.sealClosed)}>
          <Icon name="sealClosed" />
        </div>
      );
    }

    return (
      sealIcon &&
      !showFinalize && (
        <div className={styles.proposalStatusSeal}>
          <Icon name={sealIcon as IconName} />
        </div>
      )
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      data-testid="proposal-card-root"
      className={cn(styles.root, {
        [styles.clickable]: !!id && !preventNavigate,
      })}
      onMouseDown={handleCardClick}
    >
      {voteLoading && (
        <div className={styles.signingTransactionState}>
          <LoadingIndicator />
          {t('proposalCard.signingTransaction')}
        </div>
      )}
      {renderStatusSeal()}
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          valueFontSize="L"
          label={getInfoBlockWidgetLabel()}
          value={
            <div className={styles.proposalType}>
              {getProposalVariantLabel(variant, type, t)}
              {!isDraft ? (
                <ExplorerLink
                  linkData={proposalTxHash}
                  linkType="transaction"
                  className={styles.proposalWalletLink}
                />
              ) : null}
            </div>
          }
        />
      </div>
      {renderTimestampCell()}
      {renderCardContent()}
      {renderBottomContent()}
    </div>
  );
};
