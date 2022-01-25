import React, { ReactNode, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
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
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { SputnikNearService } from 'services/sputnik';
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
  const { t } = useTranslation();
  const router = useRouter();
  const { accountId } = useAuthContext();

  const claimedBy = bounty.bountyClaims.map(
    ({ accountId: claimedAccount }) => claimedAccount
  );

  const [description, url] = bounty.description.split(EXTERNAL_LINK_SEPARATOR);

  const onSuccessHandler = useCallback(async () => {
    await router.replace(router.asPath);
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      lifetime: 20000,
      description: t('bountiesPage.successClaimBountyNotification'),
    });
  }, [t, router]);

  const handleClaim = useCallback(async () => {
    await SputnikNearService.claimBounty(dao.id, {
      bountyId: Number(bounty.id),
      deadline: bounty.maxDeadline,
      bountyBond: dao.policy.bountyBond,
    });

    onSuccessHandler();
  }, [bounty, dao.policy.bountyBond, dao.id, onSuccessHandler]);

  const handleUnclaim = useCallback(async () => {
    await SputnikNearService.unclaimBounty(dao.id, bounty.bountyId);
    onSuccessHandler();
  }, [bounty.bountyId, dao.id, onSuccessHandler]);

  function renderButtons() {
    if (proposal.status === 'Approved') {
      if (!claimedBy.includes(accountId)) {
        return (
          <div className={styles.controlItem}>
            <Button
              variant="black"
              size="small"
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
          <div className={styles.controlItem}>
            <Button
              variant="secondary"
              size="small"
              type="submit"
              onClick={() => handleUnclaim()}
              className={cn(styles.unclaim, styles.button)}
            >
              Unclaim
            </Button>
          </div>
          <div className={styles.controlItem}>
            <Button
              variant="black"
              size="small"
              onClick={() => completeHandler()}
              className={cn(styles.complete, styles.button)}
            >
              Complete
            </Button>
          </div>
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
        <div className={styles.controlItem}>
          <ProposalControlButton
            icon="chat"
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
        <div className={styles.controlItem}>
          <ProposalControlButton
            icon="checkList"
            iconClassName={cn(styles.toggleCommentsButton, {
              [styles.active]: activeInfoView === 'claims',
            })}
            voted={false}
            type="button"
            times={
              <div className={styles.controlValue}>
                <span className={styles.bold}>
                  {Number(bounty.times) - Number(bounty.numberOfClaims)}
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
