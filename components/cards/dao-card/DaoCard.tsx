import React from 'react';
import TextTruncate from 'react-text-truncate';
import Link from 'next/link';

import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value/FormattedNumericValue';
import { ImageWithFallback } from 'components/image-with-fallback';

import styles from 'components/cards/dao-card/dao-card.module.scss';

import defaultFlag from 'stories/dao-home/assets/flag.png';

interface DaoCardProps {
  title: string;
  flag: string;
  daoAccountName: string;
  description: string | null;
  activeProposals: number;
  funds: string;
  members: number;
}

const DaoCard: React.FC<DaoCardProps> = ({
  title,
  flag,
  daoAccountName,
  description,
  activeProposals,
  members,
  funds
}) => {
  const renderFooterItem = (
    caption: string,
    value: number | string,
    suffix?: string
  ) => (
    <div className={styles.flexContainer}>
      <div className={styles.grayCaption}>{caption}</div>
      <FormattedNumericValue value={value} suffix={suffix} />
    </div>
  );

  return (
    <Link href={`/dao/${daoAccountName}`} passHref>
      <div className={styles.daoCard}>
        <div className={styles.iconWrapper}>
          <ImageWithFallback
            fallbackSrc={defaultFlag.src}
            src={flag}
            width={64}
            height={64}
            alt={`${title} Dao Logo`}
          />
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
    </Link>
  );
};

export default DaoCard;
