import React, { FC, useEffect } from 'react';
import { useAsync } from 'react-use';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Tooltip from 'react-tooltip';

import { SputnikHttpService } from 'services/sputnik';
import { useWalletContext } from 'context/WalletContext';

import { Icon } from 'components/Icon';

import { CREATE_DAO_URL, SINGLE_DAO_PAGE } from 'constants/routing';

import styles from './SidebarDaos.module.scss';

export const SidebarDaos: FC = () => {
  const router = useRouter();
  const { accountId } = useWalletContext();

  const { value: daos } = useAsync(async () => {
    if (!accountId) {
      return null;
    }

    return SputnikHttpService.getAccountDaos(accountId);
  }, [accountId]);

  useEffect(() => {
    Tooltip.rebuild();
  }, [daos]);

  return (
    <>
      {daos?.map(dao => {
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
              <div
                data-tip={dao.name || dao.id}
                data-place="right"
                data-offset="{ 'right': 10 }"
                data-delay-show="700"
                className={cn(styles.avatar)}
                style={{
                  backgroundImage: `url(${dao.flagLogo || dao.logo})`,
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
      <Link href={{ pathname: CREATE_DAO_URL }}>
        <a
          className={cn(styles.root, {
            [styles.active]: router.asPath.indexOf(CREATE_DAO_URL) !== -1,
          })}
        >
          <div
            className={cn(styles.avatar)}
            data-tip="Create DAO"
            data-place="right"
            data-offset="{ 'right': 10 }"
            data-delay-show="700"
          >
            <Icon name="plus" className={styles.icon} />
          </div>
          <div
            className={styles.label}
            data-expanded="hidden"
            data-value="Create DAO"
          />
        </a>
      </Link>
    </>
  );
};
