import React, { VFC } from 'react';
import { useRouter } from 'next/router';

import { SINGLE_DAO_PAGE } from 'constants/routing';

import { DAO } from 'types/dao';

import { nearConfig } from 'config';

import defaultFlag from 'assets/flag.png';
import { ImageWithFallback } from 'components/image-with-fallback';

import styles from './SearchResultDaoCard.module.scss';

interface SearchResultDaoCardProps {
  data: DAO;
  onClick: () => void;
}

export const SearchResultDaoCard: VFC<SearchResultDaoCardProps> = ({
  data,
  onClick,
}) => {
  const router = useRouter();
  const { id, logo, displayName } = data;

  const header = displayName || id.replace(nearConfig.contractName, '');

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
        <ImageWithFallback
          src={logo}
          width={60}
          height={60}
          alt="Dao Logo"
          fallbackSrc={defaultFlag.src}
        />
      </div>
      <div>
        <div className={styles.header}>{header}</div>
        <div>{id}</div>
      </div>
    </div>
  );
};
