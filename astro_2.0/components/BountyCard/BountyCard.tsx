import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { Proposal } from 'types/proposal';
import { BountyStatus } from 'types/bounties';
import { BountyCardContent } from 'astro_2.0/components/BountyCard/types';

import { Icon } from 'components/Icon';
import { TokenWidget } from 'astro_2.0/components/TokenWidget';
import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { ProposalDescription } from 'astro_2.0/components/ProposalDescription';
import { CardFooter } from 'astro_2.0/components/BountyCard/components/CardFooter';
import { BountyActionsBar } from 'astro_2.0/components/BountyCard/components/BountyActionsBar';

import styles from './BountyCard.module.scss';

export interface BountyCardProps {
  content: BountyCardContent;
  showActionBar: boolean;
  relatedProposal?: Proposal;
  claimHandler: () => void;
  unclaimHandler: () => void;
  completeHandler: () => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  content,
  showActionBar,
  claimHandler,
  unclaimHandler,
  completeHandler,
  relatedProposal,
}) => {
  const {
    status,
    description,
    timeToComplete,
    forgivenessPeriod,
    externalUrl,
    token,
    amount,
    bountyBond,
    type,
  } = content;

  function renderActionBar() {
    if (showActionBar) {
      if (status === BountyStatus.PendingApproval && relatedProposal) {
        const { id, daoId } = relatedProposal;

        return (
          <CardFooter>
            <div>
              <div className={styles.footerLabel}>Completion Proposal</div>
              <div>
                <Link
                  href={{
                    pathname: SINGLE_PROPOSAL_PAGE_URL,
                    query: {
                      dao: daoId,
                      proposal: id,
                    },
                  }}
                >
                  <a className={styles.proposalLink}>
                    <Icon name="buttonExternal" className={styles.icon} />
                    Link to Proposal
                  </a>
                </Link>
              </div>
            </div>
          </CardFooter>
        );
      }

      return (
        <BountyActionsBar
          bountyBond={bountyBond}
          forgivenessPeriod={forgivenessPeriod}
          bountyStatus={status}
          claimHandler={claimHandler}
          unclaimHandler={unclaimHandler}
          completeHandler={completeHandler}
        />
      );
    }

    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.bountyGrid}>
        <InfoBlockWidget
          label="Type"
          value={type}
          valueFontSize="L"
          className={styles.proposalType}
        />
        <div className={styles.completeDate}>
          {status === BountyStatus.Available
            ? `Complete in ${timeToComplete}`
            : `Due on ${timeToComplete}`}
        </div>
        <InfoBlockWidget
          label="Status"
          value={
            <div
              className={cn({
                [styles.statusAvailable]: status === BountyStatus.Available,
                [styles.statusInProgress]: status === BountyStatus.InProgress,
                [styles.statusExpired]: status === BountyStatus.Expired,
                [styles.pendingApproval]:
                  status === BountyStatus.PendingApproval,
              })}
            >
              {status}
            </div>
          }
          valueFontSize="L"
          className={styles.status}
        />
        <ProposalDescription
          description={description}
          link={externalUrl}
          className={styles.description}
        />
        <div className={styles.content}>
          {token ? (
            <InfoBlockWidget
              label="Amount"
              value={
                <TokenWidget
                  icon={token.icon}
                  symbol={token.symbol}
                  amount={amount}
                  decimals={token.decimals}
                />
              }
            />
          ) : (
            <div className={styles.loaderWrapper}>
              <LoadingIndicator />
            </div>
          )}
          {status === BountyStatus.InProgress ||
          status === BountyStatus.Expired ||
          status === BountyStatus.PendingApproval ? (
            <InfoBlockWidget label="Claimed by" value={content.accountId} />
          ) : (
            <InfoBlockWidget
              label="Available claims"
              value={`${content.slots}/${content.slotsTotal}`}
            />
          )}
        </div>
      </div>
      {renderActionBar()}
    </div>
  );
};
