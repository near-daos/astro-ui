import React, { ReactNode } from 'react';
import cn from 'classnames';
import { formatDistance, parseISO } from 'date-fns';

import { Bounty } from 'types/bounties';
import { Proposal } from 'types/proposal';
import { DAO } from 'types/dao';

import { kFormatter } from 'utils/format';

import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { BountyProgress } from 'astro_2.0/features/ViewBounty/components/BountyProgress';
import { ProposalControlButton } from 'astro_2.0/components/ProposalCardRenderer/components/ProposalCard/components/ProposalControlPanel/components/ProposalControlButton';
import { ExplorerLink } from 'components/ExplorerLink';
import { ExternalLink } from 'components/ExternalLink';
import { Button } from 'components/button/Button';

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';
import { useAuthContext } from 'context/AuthContext';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  bounty: Bounty;
  content: ReactNode;
  toggleInfoPanel: (val: string | null) => void;
  commentsCount: number;
  proposal: Proposal;
  activeInfoView: string | null;
  dao: DAO;
  completeHandler: () => void;
}

function getTimestampLabel(createdAt: string) {
  const distance = formatDistance(parseISO(createdAt), new Date());

  return `Added ${distance} ago`;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  dao,
  bounty,
  content,
  proposal,
  toggleInfoPanel,
  commentsCount,
  activeInfoView,
  completeHandler,
}) => {
  const { accountId } = useAuthContext();

  const [description, url] = bounty.description.split(EXTERNAL_LINK_SEPARATOR);

  const { handleUnclaim, handleClaim } = useBountyControls(dao, bounty);

  function renderButtons() {
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

      if (hasAvailableClaims && !hasInProgressClaims) {
        return (
          <div className={cn(styles.controlItem, styles.btnWrapper)}>
            <Button
              variant="black"
              size="block"
              type="submit"
              onClick={() => handleClaim()}
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
                onClick={() => handleUnclaim()}
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
                onClick={() => completeHandler()}
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
    <div className={cn(styles.root)}>
      <div className={styles.proposalCell}>
        <InfoBlockWidget
          valueFontSize="L"
          label="Bounty name"
          value={
            <div className={styles.proposalType}>
              {description}
              <ExplorerLink
                linkData={proposal.txHash}
                linkType="transaction"
                className={styles.proposalWalletLink}
              />
            </div>
          }
        />
      </div>
      <div className={styles.countdownCell}>
        {getTimestampLabel(bounty.createdAt)}
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
          <ProposalControlButton
            icon="chat"
            className={styles.controlButton}
            iconClassName={cn(styles.toggleCommentsButton, {
              [styles.active]: activeInfoView === 'comments',
            })}
            voted={false}
            type="button"
            times={
              <div className={styles.controlValue}>
                <span className={styles.bold}>{kFormatter(commentsCount)}</span>
              </div>
            }
            onClick={() =>
              toggleInfoPanel(activeInfoView === 'comments' ? null : 'comments')
            }
            disabled={false}
          />
        </div>
        <div className={cn(styles.controlItem, styles.claims)}>
          <ProposalControlButton
            icon="claimsLink"
            className={styles.controlButton}
            iconClassName={cn(styles.toggleCommentsButton, {
              [styles.active]: activeInfoView === 'claims',
            })}
            voted={false}
            type="button"
            times={
              <div className={styles.controlValue}>
                <span className={styles.bold}>
                  {Number(bounty.numberOfClaims)}
                </span>
                /<span>{bounty.times}</span>
              </div>
            }
            onClick={() =>
              toggleInfoPanel(activeInfoView === 'claims' ? null : 'claims')
            }
            disabled={false}
          />
        </div>
        {renderButtons()}
      </div>
    </div>
  );
};
