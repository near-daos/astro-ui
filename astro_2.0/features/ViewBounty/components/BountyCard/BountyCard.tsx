import React, { ReactNode, useCallback } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { formatDistance, parseISO } from 'date-fns';

import { Bounty, BountyProposal } from 'types/bounties';
import { DAO } from 'types/dao';

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

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';
import { useAuthContext } from 'context/AuthContext';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { SINGLE_BOUNTY_PAGE_URL } from 'constants/routing';

import { AddBountyRequest, ProposalType } from 'types/proposal';

import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  bounty?: Bounty;
  content: ReactNode;
  toggleInfoPanel: (val: string | null) => void;
  commentsCount: number;
  proposal: BountyProposal;
  activeInfoView: string | null;
  dao: DAO;
  completeHandler: () => void;
  contextId: string;
}

function getTimestampLabel(createdAt: string) {
  const distance = formatDistance(parseISO(createdAt), new Date());

  return `Added ${distance} ago`;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  contextId,
  dao,
  bounty,
  content,
  proposal,
  toggleInfoPanel,
  commentsCount,
  activeInfoView,
  completeHandler,
}) => {
  const router = useRouter();
  const { accountId } = useAuthContext();
  const canNavigateToBounty = !router.query.bounty;

  const desc = bounty ? bounty.description : proposal.description;
  const [description, url] = desc.split(EXTERNAL_LINK_SEPARATOR);
  const kind = proposal.kind as {
    type: ProposalType.AddBounty;
    bounty: AddBountyRequest;
  };
  const bountyData = kind.bounty;

  const { handleUnclaim, handleClaim } = useBountyControls(dao, bounty);

  const handleCardClick = useCallback(() => {
    if (canNavigateToBounty) {
      router.push({
        pathname: SINGLE_BOUNTY_PAGE_URL,
        query: {
          dao: dao.id,
          bountyContext: contextId,
        },
      });
    }
  }, [canNavigateToBounty, contextId, dao.id, router]);

  function renderButtons() {
    if (!bounty && proposal) {
      return (
        <div className={cn(styles.controlItem, styles.span)}>
          <VotingContent
            proposal={proposal}
            accountId={accountId}
            dao={dao}
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
                className={cn(styles.unclaim, styles.button)}
              >
                Unclaim
              </Button>
            </div>
          )}

          {hasInProgressClaims && !hasPendingProposals && (
            <div className={cn(styles.controlItem, styles.btnWrapper)}>
              <Button
                variant="black"
                size="block"
                onClick={e => {
                  e.stopPropagation();
                  completeHandler();
                }}
                className={cn(styles.complete, styles.button)}
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
        {renderButtons()}
      </div>
      <div className={styles.actionBar}>
        <BountyActions
          description={description}
          contextId={contextId}
          daoId={dao.id}
        />
      </div>
    </div>
  );
};
