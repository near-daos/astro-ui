import React, { FC, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import { useAsync, useLockBodyScroll } from 'react-use';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { Title } from 'components/Typography';

import { useWalletContext } from 'context/WalletContext';

import { SputnikHttpService } from 'services/sputnik';

import { SINGLE_DAO_PAGE } from 'constants/routing';

import { getDaoAvatar } from 'astro_3.0/features/Sidebar/helpers';

import styles from './MobileDaosMenu.module.scss';

export const MobileDaosMenu: FC = () => {
  const router = useRouter();
  const { accountId } = useWalletContext();
  const [expanded, setExpanded] = useState(false);

  const { loading, value: daos } = useAsync(async () => {
    if (!accountId) {
      return null;
    }

    return SputnikHttpService.getAccountDaos(accountId);
  }, [accountId]);

  const handleRouteChange = useCallback(() => {
    if (expanded) {
      setExpanded(false);
    }
  }, [expanded]);

  useEffect(() => {
    Router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [handleRouteChange]);

  useLockBodyScroll(expanded);

  return (
    <div
      className={cn(styles.root, {
        [styles.expanded]: expanded,
      })}
    >
      <div className={styles.toggleWrapper}>
        <Button
          className={styles.toggle}
          variant="transparent"
          size="block"
          onClick={() => setExpanded(!expanded)}
          data-title="My DAOs"
        >
          <Icon
            name={expanded ? 'close' : 'burgerMenu'}
            className={styles.icon}
          />
        </Button>
      </div>
      <div className={styles.content}>
        {!loading && !daos?.length ? (
          <div className={styles.noDaosWarning}>
            <h2>No available DAOs</h2>
            <Title size={2}>Let`s create DAO and manage it</Title>
            <div className={cn(styles.image)} />
            <Button
              variant="green"
              size="medium"
              capitalize
              className={styles.createDaoButton}
            >
              <Icon name="plus" className={styles.icon} />
              Create DAO
            </Button>
          </div>
        ) : (
          <div className={styles.list}>
            {daos?.map(dao => {
              const avatar = getDaoAvatar(dao);

              return (
                <Link
                  key={dao.id}
                  href={{ pathname: SINGLE_DAO_PAGE, query: { dao: dao.id } }}
                >
                  <a
                    className={cn(styles.listItem, {
                      [styles.active]: router.asPath.indexOf(dao.id) !== -1,
                    })}
                  >
                    <div
                      className={cn(styles.avatar)}
                      style={{
                        backgroundImage: `url(${avatar})`,
                      }}
                    />

                    <div className={styles.label}>{dao.name || dao.id}</div>
                  </a>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
