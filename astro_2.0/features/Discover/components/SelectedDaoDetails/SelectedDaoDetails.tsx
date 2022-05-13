import React, { FC, useEffect, useState, useCallback } from 'react';
import { useMountedState } from 'react-use';
import { useRouter } from 'next/router';

import useQuery from 'hooks/useQuery';
import { DAO } from 'types/dao';

import { shortenString } from 'utils/format';
import { SINGLE_DAO_PAGE } from 'constants/routing';

import { SputnikHttpService } from 'services/sputnik';

import { Button } from 'components/button/Button';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { IconButton } from 'components/button/IconButton';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';

import styles from './SelectedDaoDetails.module.scss';

export const SelectedDaoDetails: FC = () => {
  const isMounted = useMountedState();
  const router = useRouter();
  const [data, setData] = useState<DAO | null>(null);
  const { query, updateQuery } = useQuery<{
    dao: string;
  }>({ shallow: true });

  useEffect(() => {
    if (query.dao) {
      SputnikHttpService.getDaoById(query.dao).then(res => {
        if (isMounted()) {
          setData(res);
        }
      });
    } else {
      setData(null);
    }
  }, [isMounted, query.dao]);

  const goToDaoPage = useCallback(() => {
    router.push({
      pathname: SINGLE_DAO_PAGE,
      query: {
        dao: data?.id,
      },
    });
  }, [data, router]);

  const onClose = useCallback(() => {
    updateQuery('dao', '');
  }, [updateQuery]);

  if (!data) {
    return null;
  }

  return (
    <div className={styles.root}>
      <IconButton
        onClick={onClose}
        icon="closeCircle"
        className={styles.close}
      />
      <div className={styles.name}>
        <DaoLogo src={data.flagCover || data.flagLogo || data.logo} size="md" />
        <div className={styles.details}>
          <div className={styles.daoName}>{data.name ?? data.id}</div>
          <div className={styles.address}>
            <CopyButton text={data.id} tooltipPlacement="auto">
              <div className={styles.addressId}>
                {shortenString(data.id, 36)}
              </div>
            </CopyButton>
          </div>
        </div>
      </div>
      <Button
        className={styles.navButton}
        size="medium"
        variant="secondary"
        onClick={goToDaoPage}
      >
        Go to DAO page
      </Button>
    </div>
  );
};
