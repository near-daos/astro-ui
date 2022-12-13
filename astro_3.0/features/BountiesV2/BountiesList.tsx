import React, { FC } from 'react';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DATA_SEPARATOR } from 'constants/common';
import { IconButton } from 'components/button/IconButton';
import { formatYoktoValue, kFormatter } from 'utils/format';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { BountyContext } from 'types/bounties';
import { getTimestampLabel } from 'astro_2.0/features/ViewBounty/components/BountyCard';

import styles from './BountiesList.module.scss';

interface BountiesListProps {
  bountiesContext: BountyContext[];
}

export const BountiesList: FC<BountiesListProps> = ({ bountiesContext }) => {
  if (!bountiesContext?.length) {
    return <NoResultsView title="no results" />;
  }

  return (
    <div className={styles.bountiesList}>
      {/* Headers */}
      <div className={styles.header}>
        <div />
        <div>ORG</div>
        <div>TYPE</div>
        <div>DESCRIPTION</div>
        <div>TAGS</div>
        <div>RECENCY</div>
        <div>AMOUNT</div>
        <div />
        <div />
      </div>

      {/* Body */}
      {bountiesContext.map(bountyContext => {
        const rawDescription = bountyContext.bounty.description;
        const description = rawDescription.split(DATA_SEPARATOR)[0];
        const daoLogo =
          bountyContext.proposal?.dao?.flagLogo ||
          '/avatars/defaultDaoAvatar.png';

        const { createdAt } = bountyContext.bounty;
        const recency = createdAt ? getTimestampLabel(createdAt) : 'N/A';

        const rawAmount = bountyContext.bounty.amount;
        const amount = rawAmount
          ? kFormatter(Number(formatYoktoValue(rawAmount)), 2)
          : '0';

        return (
          <div className={styles.row} key={bountyContext.bounty.id}>
            <div>
              <div
                className={styles.daoLogo}
                style={{
                  backgroundImage: `url(${daoLogo})`,
                }}
              />
            </div>
            <div className={styles.daoName}>
              {bountyContext.proposal?.dao?.name}
            </div>

            <div className={styles.bountyType}>
              {bountyContext.proposal?.kind?.type}
            </div>
            <div>{description}</div>
            <div className={styles.tags}>
              {bountyContext.bounty.tags
                ?.map((tag: string) => `#${tag}`)
                .join(', ')}
            </div>
            <div>{recency}</div>
            <div className={styles.amount}>{amount} NEAR</div>
            <div>
              <CopyButton
                text={`/dao/${bountyContext.proposal?.dao?.id}/proposals/${bountyContext.proposal?.id}`}
                tooltipPlacement="auto"
                className={styles.icon}
              />
            </div>
            <div>
              <IconButton
                size="medium"
                icon="buttonArrowRight"
                className={styles.icon}
                onClick={() => {
                  window.open(
                    `/dao/${bountyContext.proposal?.dao?.id}/proposals/${bountyContext.proposal?.id}`
                  );
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
