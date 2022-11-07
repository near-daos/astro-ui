import React, { FC, useMemo } from 'react';
import { useAsync } from 'react-use';
import { useTranslation } from 'next-i18next';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { Loader } from 'components/loader';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import { AllowanceKeyRow } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/components/AllowanceKeysRow';

import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';
import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';

import { DaoWithAllowanceKey } from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/types';

import styles from 'astro_2.0/features/pages/myAccount/cards/AllowanceKeysCard/AllowanceKeysCard.module.scss';

export const AllowanceKeysCard: FC = () => {
  const { t } = useTranslation();
  const { useOpenSearchDataApi } = useFlags();
  const { accountId, nearService } = useWalletContext();

  const { data: accountDaosOs, isLoading } = useAccountDaos();
  const { value: accountDaosApi, loading } = useAsync(async () => {
    if (
      !accountId ||
      useOpenSearchDataApi ||
      useOpenSearchDataApi === undefined
    ) {
      return [];
    }

    return SputnikHttpService.getAccountDaos(accountId);
  }, [accountId, useOpenSearchDataApi]);
  const { value: allowanceKeys } = useAsync(async () => {
    return (await nearService?.getAllowanceKeys()) ?? [];
  }, [nearService]);

  const daosWithAllowanceKey = useMemo(() => {
    const daosList = accountDaosOs ?? accountDaosApi;

    if (!daosList || !allowanceKeys) {
      return [];
    }

    const result: DaoWithAllowanceKey[] = daosList.map(dao => {
      return {
        daoId: dao.id,
        daoName: dao.displayName,
        allowanceKey: allowanceKeys.find(key => key.daoId === dao.id),
      };
    });

    return result;
  }, [accountDaosApi, accountDaosOs, allowanceKeys]);

  return (
    <ConfigCard>
      <CardTitle>{t('myAccountPage.allowanceVotingKeys')}</CardTitle>
      {loading || isLoading ? (
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
