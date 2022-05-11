import React, { VFC } from 'react';
import { useRouter } from 'next/router';

import { SINGLE_DAO_PAGE } from 'constants/routing';

import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';

import { DaoFeedItem } from 'types/dao';

import { configService } from 'services/ConfigService';

import styles from './SearchResultDaoCard.module.scss';

interface SearchResultDaoCardProps {
  data: DaoFeedItem;
  onClick: () => void;
}

export const SearchResultDaoCard: VFC<SearchResultDaoCardProps> = ({
  data,
  onClick,
}) => {
  const router = useRouter();
  const { id, logo, flagLogo, displayName } = data;

  const { nearConfig } = configService.get();

  const header = displayName || id.replace(nearConfig?.contractName ?? '', '');

  function goToDao() {
    onClick();
    router.push({
      pathname: SINGLE_DAO_PAGE,
      query: {
        dao: id,
      },
    });
  }

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={goToDao}
      onKeyPress={goToDao}
      className={styles.root}
    >
      <div className={styles.flagHolder}>
        <DaoLogo size="md" src={flagLogo || logo} />
      </div>
      <div>
        <div className={styles.header}>{header}</div>
        <div className={styles.sub}>{id}</div>
      </div>
    </div>
  );
};
