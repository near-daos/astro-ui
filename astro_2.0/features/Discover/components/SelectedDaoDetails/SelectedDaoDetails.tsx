import React, { FC, useEffect, useState } from 'react';
import { useMountedState } from 'react-use';
import { useRouter } from 'next/router';

import useQuery from 'hooks/useQuery';
import { DAO } from 'types/dao';

import { shortenString } from 'utils/format';
import { SINGLE_DAO_PAGE } from 'constants/routing';

import { SputnikHttpService } from 'services/sputnik';

import { Button } from 'components/button/Button';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { IconButton } from 'components/button/IconButton';

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

  if (!data) {
    return null;
  }

  return (
    <div className={styles.root}>
      <IconButton
        icon="closeCircle"
        className={styles.close}
        onClick={() => updateQuery('dao', '')}
      />
      <div className={styles.name}>
        <FlagRenderer
          flag={data.flagCover}
          logo={data.flagLogo}
          fallBack={data.logo}
          size="xs"
        />
        <div className={styles.details}>
          <div className={styles.daoName}>{data.name ?? data.id}</div>
          <div className={styles.address}>
            <div className={styles.addressId}>{shortenString(data.id, 36)}</div>
            <CopyButton
              text={data.id}
              tooltipPlacement="auto"
              className={styles.copyAddress}
            />
          </div>
        </div>
      </div>
      <Button
        className={styles.navButton}
        size="medium"
        variant="secondary"
        onClick={() =>
          router.push({
            pathname: SINGLE_DAO_PAGE,
            query: {
              dao: data.id,
            },
          })
        }
      >
        Go to DAO page
      </Button>
    </div>
  );
};
