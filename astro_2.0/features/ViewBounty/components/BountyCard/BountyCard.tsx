import React, { ReactNode, useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { formatDistance, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';

import { Bounty, BountyProposal } from 'types/bounties';

import { kFormatter } from 'utils/format';

import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { BountyProgress } from 'astro_2.0/features/ViewBounty/components/BountyProgress';
import { ExplorerLink } from 'components/ExplorerLink';
import { ExternalLink } from 'components/ExternalLink';
import { Button } from 'components/button/Button';
import { VotingContent } from 'astro_2.0/features/Bounties/components/BountiesListView/components/VotingContent';
import { BountyActions } from 'astro_2.0/features/ViewBounty/components/BountyActions';
import { Icon } from 'components/Icon';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';
import { useWalletContext } from 'context/WalletContext';
import { DATA_SEPARATOR } from 'constants/common';
import { SINGLE_BOUNTY_PAGE_URL } from 'constants/routing';

import { AddBountyRequest, ProposalType } from 'types/proposal';
import { UserPermissions } from 'types/context';

import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  bounty?: Bounty;
  content: ReactNode;
  toggleInfoPanel: (val: string | null) => void;
  commentsCount: number;
  proposal: BountyProposal;
  activeInfoView: string | null;
  daoId: string;
  completeHandler: () => void;
  contextId: string;
  permissions?: UserPermissions;
}

function getTimestampLabel(createdAt: string) {
  const distance = formatDistance(parseISO(createdAt), new Date());

  return `Added ${distance} ago`;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  contextId,
  daoId,
  bounty,
  content,
  proposal,
  toggleInfoPanel,
  commentsCount,
  activeInfoView,
  completeHandler,
  permissions,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { accountId } = useWalletContext();
  const canNavigateToBounty = !router.query.bounty;

  const desc = bounty ? bounty.description : proposal.description;
  const [description, url] = desc.split(DATA_SEPARATOR);
  const kind = proposal?.kind as {
    type: ProposalType.AddBounty;
    bounty: AddBountyRequest;
  };
  const bountyData = kind.bounty;

  const { handleUnclaim, handleClaim, loading } = useBountyControls(
    daoId,
    bounty
  );

  const handleCardClick = useCallback(() => {
    if (canNavigateToBounty) {
      router.push({
        pathname: SINGLE_BOUNTY_PAGE_URL,
        query: {
          dao: daoId,
          bountyContext: contextId,
        },
      });
    }
  }, [canNavigateToBounty, contextId, daoId, router]);

  function renderButtons() {
    if (!accountId) {
      return null;
    }

    if (!bounty && proposal) {
      return (
        <div className={cn(styles.controlItem, styles.span)}>
          <VotingContent
            proposal={proposal}
            accountId={accountId}
            daoId={daoId}
            className={styles.voting}
          />
        </div>
      );
    }

    if (!bounty) {
      return null;
    }

    if (proposal.status === 'Approved') {
      const myClaims = bounty.bountyClaims.filter(
        claim => claim.accountId === accountId
      );
      const hasAvailableClaims =
        Number(bounty.times) - bounty.numberOfClaims > 0;

      // check if I have inProgress claim
      let hasInProgressClaims = false;
      let hasPendingProposals = false;

      myClaims.forEach(claim => {
        const doneProposal = bounty.bountyDoneProposals.find(
          _doneProposal => _doneProposal.bountyClaimId === claim.id
        );

        if (!doneProposal) {
          hasInProgressClaims = true;
        }

        if (doneProposal && doneProposal.status === 'InProgress') {
          hasPendingProposals = true;
        }
      });

      if (hasAvailableClaims && !hasInProgressClaims && !hasPendingProposals) {
        return (
          <div
            className={cn(styles.controlItem, styles.btnWrapper, styles.span)}
          >
            <Button
              variant="black"
              size="block"
              type="submit"
              onClick={e => {
                e.stopPropagation();
                handleClaim();
              }}
              className={cn(styles.claim, styles.button)}
            >
              Claim
            </Button>
          </div>
        );
      }

      return (
        <>
          {hasInProgressClaims && (
            <div className={cn(styles.controlItem, styles.btnWrapper)}>
              <Button
                variant="secondary"
                size="block"
                type="submit"
                onClick={e => {
                  e.stopPropagation();
                  handleUnclaim();
                }}
                className={cn(styles.unclaim, styles.button, styles.unclaimBtn)}
              >
                Unclaim
              </Button>
            </div>
          )}

          {hasInProgressClaims &&
            !hasPendingProposals &&
            permissions?.allowedProposalsToCreate[ProposalType.BountyDone] && (
              <div className={cn(styles.controlItem, styles.btnWrapper)}>
                <Button
                  variant="black"
                  size="block"
                  onClick={e => {
                    e.stopPropagation();
                    completeHandler();
                  }}
                  className={cn(
                    styles.complete,
                    styles.button,
                    styles.completeBtn
                  )}
                >
                  Complete
                </Button>
              </div>
            )}
        </>
      );
    }

    return null;
  }

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyPress={handleCardClick}
      className={cn(styles.root, {
        [styles.clickable]: canNavigateToBounty,
      })}
      onClick={handleCardClick}
    >
      {loading && (
        <div className={styles.signingTransactionState}>
          <LoadingIndicator />
          {t('proposalCard.signingTransaction')}
        </div>
      )}
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          valueFontSize="L"
          label="Bounty name"
          value={
            <div className={styles.proposalType}>
              <div className={styles.ellipse}>{description}</div>
              <ExplorerLink
                linkData={proposal.transactionHash}
                linkType="transaction"
                className={styles.proposalWalletLink}
              />
            </div>
          }
        />
      </div>
      <div className={styles.countdownCell}>
        {getTimestampLabel(bounty ? bounty.createdAt : proposal.createdAt)}
      </div>
      <div className={styles.proposerCell}>
        <InfoBlockWidget label="Proposer" value={proposal.proposer} />
      </div>
      <div className={styles.progressCell}>
        <BountyProgress proposal={proposal} bounty={bounty} />
      </div>
      <div className={styles.descriptionCell}>
        <FieldWrapper label="Description" fullWidth>
          <div className={styles.proposalDescription}>{description}</div>
        </FieldWrapper>

        <div className={styles.proposalExternalLink}>
          <ExternalLink to={url} />
        </div>
      </div>
      <div className={styles.contentCell}>{content}</div>
      <div className={styles.voteControlCell}>
        <div className={cn(styles.controlItem, styles.comments)}>
          <Button
            variant="transparent"
            size="small"
            className={styles.toggleBtn}
            onClick={e => {
              e.stopPropagation();
              toggleInfoPanel(
                activeInfoView === 'comments' ? null : 'comments'
              );
            }}
            disabled={false}
          >
            <Icon
              name="chat"
              className={cn(styles.toggleCommentsButton, {
                [styles.active]: activeInfoView === 'comments',
              })}
            />
            <div className={styles.controlValue}>
              <span className={styles.bold}>{kFormatter(commentsCount)}</span>
            </div>
          </Button>
        </div>
        {bounty && (
          <div className={cn(styles.controlItem, styles.claims)}>
            <Button
              variant="transparent"
              size="small"
              className={styles.toggleBtn}
              onClick={e => {
                e.stopPropagation();
                toggleInfoPanel(activeInfoView === 'claims' ? null : 'claims');
              }}
              disabled={false}
            >
              <Icon
                name="claimsLink"
                className={cn(styles.toggleCommentsButton, {
                  [styles.active]: activeInfoView === 'claims',
                })}
              />
              <div className={styles.controlValue}>
                <span className={styles.bold}>
                  {Number(bounty?.numberOfClaims ?? 0)}
                </span>
                /<span>{bounty?.times ?? bountyData.times}</span>
              </div>
            </Button>
          </div>
        )}
        {renderButtons()}
      </div>
      <div className={styles.actionBar}>
        <BountyActions
          description={description}
          contextId={contextId}
          daoId={daoId}
        />
      </div>
    </div>
  );
};
