import React from 'react';
import TextTruncate from 'react-text-truncate';

import { FlagIcon } from 'components/cards/dao-card/FlagIcon';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value/FormattedNumericValue';

import styles from 'components/cards/dao-card/dao-card.module.scss';

interface DaoCardProps {
  title: string;
  daoAccountName: string;
  description: string | null;
  activeProposals: number;
  funds: number;
  members: number;
}

const DaoCard: React.FC<DaoCardProps> = ({
  title,
  daoAccountName,
  description,
  activeProposals,
  members,
  funds
}) => {
  const renderFooterItem = (
    caption: string,
    value: number,
    suffix?: string
  ) => (
    <div className={styles.flexContainer}>
      <div className={styles.grayCaption}>{caption}</div>
      <FormattedNumericValue value={value} suffix={suffix} />
    </div>
  );

  return (
    <div className={styles.daoCard}>
      <div className={styles.iconWrapper}>
        <FlagIcon />
      </div>
      <div className={styles.titleCaption}>
        <h2 className={styles.noMargin}>{title}</h2>
      </div>
      <div className={styles.urlCaption}>{daoAccountName}</div>
      <div className={styles.descriptionCaption}>
        <TextTruncate
          line={2}
          element="span"
          truncateText="…"
          text={description ?? ''}
          textTruncateChild={null}
        />
      </div>
      <div className={styles.activeProposals}>
        <div className={styles.activeProposalsCaption}>
          {activeProposals} active proposals
        </div>
      </div>
      <div className={styles.membersAndFunds}>
        {renderFooterItem('Members', members)}
        {renderFooterItem('Funds', funds, 'usd')}
      </div>
    </div>
  );
};

export default DaoCard;
