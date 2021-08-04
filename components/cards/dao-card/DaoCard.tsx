import React from 'react';
import classNames from 'classnames';
import styles from 'components/cards/dao-card/dao-card.module.scss';
import { FlagIcon } from 'components/cards/dao-card/FlagIcon';

interface DaoCardProps {
  title: string;
  url: string;
  description: string;
  activeProposals: number;
  funds: number;
  members: number;
}

const DaoCard: React.FC<DaoCardProps> = ({
  title,
  url,
  description,
  activeProposals,
  members,
  funds
}) => {
  const renderFooterItem = (caption: string, value: string) => (
    <div className={styles['flex-container']}>
      <div className={(styles['gray-caption'], 'subtitle4')}>{caption}</div>
      <div className={classNames(styles['upper-case'], 'title3')}>{value}</div>
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
        {url}
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
        {renderFooterItem('Members', members.toLocaleString())}
        {renderFooterItem('Funds', `${funds.toLocaleString()} USD`)}
      </div>
    </div>
  );
};

export default DaoCard;
