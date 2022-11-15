import React, { FC, useEffect } from 'react';
import { useAsync } from 'react-use';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Tooltip from 'react-tooltip';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';
import { SidebarMarker } from 'astro_3.0/features/Sidebar/components/SidebarMarker';
import { SINGLE_DAO_PAGE } from 'constants/routing';

import { useAccountDaos } from 'services/ApiService/hooks/useAccountDaos';

import { getDaoAvatar } from 'astro_3.0/features/Sidebar/helpers';
import styles from './SidebarDaos.module.scss';

export const SidebarDaos: FC = () => {
  const router = useRouter();
  const { accountId } = useWalletContext();
  const { useOpenSearchDataApi } = useFlags();
  const { data } = useAccountDaos(true);

  const { value } = useAsync(async () => {
    if (
      !accountId ||
      useOpenSearchDataApi ||
      useOpenSearchDataApi === undefined
    ) {
      return null;
    }

    return SputnikHttpService.getAccountDaos(accountId);
  }, [accountId, useOpenSearchDataApi]);

  const daos = value || data;

  useEffect(() => {
    Tooltip.rebuild();
  }, [daos]);

  return (
    <>
      {daos && <SidebarMarker items={daos} />}
      {daos?.map(dao => {
        const avatar = getDaoAvatar(dao);

        return (
          <Link
            key={dao.id}
            href={{ pathname: SINGLE_DAO_PAGE, query: { dao: dao.id } }}
          >
            <a
              className={cn(styles.root, {
                [styles.active]: router.asPath.indexOf(dao.id) !== -1,
              })}
            >
              <svg
                className={styles.marker}
                width="3"
                height="40"
                viewBox="0 0 3 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 40C2.10457 40 3 39.1046 3 38L3 2C3 0.895432 2.10457 0 1 0H0C0 22 0 22 0 40H1Z"
                  fill="#E8E0FF"
                />
              </svg>

              <div
                data-tip={dao.name || dao.id}
                data-place="right"
                data-offset="{ 'right': 10 }"
                data-delay-show="700"
                className={cn(styles.avatar)}
                style={{
                  backgroundImage: `url(${avatar})`,
                }}
              />

              <div
                className={styles.label}
                data-expanded="hidden"
                data-value={dao.name || dao.id}
              />
            </a>
          </Link>
        );
      })}
    </>
  );
};
