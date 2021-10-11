import React from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';

import { DAO } from 'types/dao';

import defaultFlag from 'stories/dao-home/assets/flag.png';

import { ImageWithFallback } from 'components/image-with-fallback';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value/FormattedNumericValue';

import { formatCurrency } from 'utils/formatCurrency';

import styles from 'components/cards/dao-card/dao-card.module.scss';

interface DaoCardProps {
  dao: DAO;
  title: string;
  flag: string;
  daoAccountName: string;
  description: string | null;
  members: number;
  nearPrice: number;
}

// TODO refactor component to get all data from dao prop
const DaoCard: React.FC<DaoCardProps> = ({
  dao,
  title,
  flag,
  daoAccountName,
  description,
  nearPrice,
  members
}) => {
  const { funds, proposals } = dao;

  function roundToTwoDigits(num: string) {
    return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
  }

  function getUSDFunds() {
    return formatCurrency(parseFloat(funds) * nearPrice);
  }

  return (
    <Link href={`/dao/${daoAccountName}`} passHref>
      <div className={styles.daoCard}>
        <div>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <ImageWithFallback
                fallbackSrc={defaultFlag.src}
                src={flag}
                width={140}
                height={140}
                alt={`${title} Dao Logo`}
              />
            </div>
            <div>
              <h2 className={styles.noMargin}>{title}</h2>
              <div className={styles.urlCaption}>{daoAccountName}</div>
            </div>
          </div>
          <div className={styles.descriptionCaption}>
            <TextTruncate
              line={3}
              element="span"
              truncateText="…"
              text={description ?? ''}
              textTruncateChild={null}
            />
          </div>
        </div>
        <div>
          <div className={styles.membersAndFunds}>
            <div className={styles.membersAndFundsContainer}>
              <div className={styles.grayCaption}>Members</div>
              <FormattedNumericValue value={members} />
            </div>
            <div className={styles.membersAndFundsContainer}>
              <div className={styles.grayCaption}>Funds</div>
              <FormattedNumericValue
                suffix="NEAR"
                value={roundToTwoDigits(funds)}
                valueClassName={styles.nearFundsValue}
                suffixClassName={styles.nearFundsSuffix}
              />
              <FormattedNumericValue
                suffix="usd"
                value={getUSDFunds()}
                valueClassName={styles.usdFundsValue}
                suffixClassName={styles.usdFundsSuffix}
              />
            </div>
          </div>
          <div className={styles.delimiter} />
          <div className={styles.activeProposals}>
            <span className={styles.activeProposalsNumber}>
              {proposals}&nbsp;
            </span>
            active proposals
          </div>
          {/* <div className={styles.totalProposals}>{proposals} in total</div> */}
          <div className={styles.createProposal}>Create Proposal</div>
        </div>
      </div>
    </Link>
  );
};

export default DaoCard;
