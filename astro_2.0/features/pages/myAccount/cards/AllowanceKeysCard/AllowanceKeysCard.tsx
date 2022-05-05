import React, { FC, useEffect, useState } from 'react';
import { useAsyncFn, useMountedState } from 'react-use';

import { Loader } from 'components/loader';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { AllowanceKeyRow } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/components/AllowanceKeysRow';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';

import styles from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/AllowanceKeysCard.module.scss';
import { DaoWithAllowanceKey } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/types';

export const AllowanceKeysCard: FC = () => {
  const isMounted = useMountedState();
  const { accountId, nearService } = useWalletContext();
  const [daosWithAllowanceKey, setDaosWithAllowanceKey] = useState<
    DaoWithAllowanceKey[]
  >([]);

  const [{ loading }, getDaosList] = useAsyncFn(async () => {
    const daosList = await SputnikHttpService.getAccountDaos(accountId);
    const allowanceKeys = (await nearService?.getAllowanceKeys()) ?? [];

    const result: DaoWithAllowanceKey[] = daosList.map(dao => {
      return {
        daoId: dao.id,
        allowanceKey: allowanceKeys.find(key => key.daoId === dao.id),
      };
    });

    if (isMounted()) {
      setDaosWithAllowanceKey(result);
    }
  }, [accountId, isMounted]);

  useEffect(() => {
    (async () => {
      await getDaosList();
    })();
  }, [getDaosList]);

  return (
    <ConfigCard>
      <CardTitle>Allowance voting keys</CardTitle>
      {loading ? (
        <Loader className={styles.loader} />
      ) : (
        <div className={styles.content}>
          {daosWithAllowanceKey.map(item => (
            <AllowanceKeyRow daoWithAllowanceKey={item} key={item.daoId} />
          ))}
        </div>
      )}
    </ConfigCard>
  );
};
