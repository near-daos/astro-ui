import React from 'react';
import classNames from 'classnames';
import styles from 'components/cards/dao-card/dao-card.module.scss';
import { FlagIcon } from 'components/cards/dao-card/FlagIcon';
import { FormattedNumericValue } from 'components/cards/components/formatted-numeric-value/FormattedNumericValue';

interface DaoCardProps {
  title: string;
  daoAccountName: string;
  description: string;
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
    <div className={styles['flex-container']}>
      <div className={(styles['gray-caption'], 'subtitle4')}>{caption}</div>
      <FormattedNumericValue value={value} suffix={suffix} />
    </div>
  );

  return (
    <div className={styles['dao-card']}>
      <div className={styles['icon-wrapper']}>
        <FlagIcon />
      </div>
      <div className={styles['title-caption']}>
        <h2 className={styles['no-margin']}>{title}</h2>
      </div>
      <div className={classNames('subtitle3', styles['url-caption'])}>
        {daoAccountName}
      </div>
      <div className={classNames('body1', styles['description-caption'])}>
        {description}
      </div>
      <div className={styles['active-proposals']}>
        <div
          className={classNames(styles['active-proposals-caption'], 'title4')}
        >
          {activeProposals} active proposals
        </div>
      </div>
      <div className={styles['members-and-funds']}>
        {renderFooterItem('Members', members)}
        {renderFooterItem('Funds', funds, 'usd')}
      </div>
    </div>
  );
};

export default DaoCard;
