import React, { FC, useEffect, useState } from 'react';
import { useAsyncFn, useMountedState } from 'react-use';

import { Loader } from 'components/loader';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { VoteCreditRow } from 'astro_2.0/features/pages/myAccount/cards/VoteCreditCard/components/VoteCreditRow';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';

import { DaoFeedItem } from 'types/dao';

import styles from './VoteCreditCard.module.scss';

export const VoteCreditCard: FC = () => {
  const isMounted = useMountedState();
  const { accountId } = useWalletContext();
  const [accountDaos, setAccountDaos] = useState<DaoFeedItem[]>([]);

  const [{ loading }, getDaosList] = useAsyncFn(async () => {
    const daosList = await SputnikHttpService.getAccountDaos(accountId);

    if (isMounted()) {
      setAccountDaos(daosList);
    }
  }, [accountId, isMounted]);

  useEffect(() => {
    (async () => {
      await getDaosList();
    })();
  }, [getDaosList]);

  return (
    <ConfigCard>
      <CardTitle>Available vote credit without confirmation</CardTitle>
      {loading ? (
        <Loader className={styles.loader} />
      ) : (
        <div className={styles.content}>
          {accountDaos.map(item => (
            <VoteCreditRow dao={item} key={item.id} />
          ))}
        </div>
      )}
    </ConfigCard>
  );
};
