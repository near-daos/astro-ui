import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { useDaoUpgradeStatus } from 'astro_2.0/features/DaoDashboardHeader/hooks';

import { UserPermissions } from 'types/context';
import { DAO } from 'types/dao';

import { DaoWarning } from 'astro_2.0/components/DaoWarning';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import { DAO_VERSION_PAGE_URL } from 'constants/routing';

import styles from './UpgradeDaoWarning.module.scss';

interface Props {
  dao: DAO;
  userPermissions: UserPermissions;
  className?: string;
}

export const UpgradeDaoWarning: FC<Props> = ({
  dao,
  userPermissions,
  className,
}) => {
  const router = useRouter();
  const { isUpgradeAvailable, isUpgradeInProgress } = useDaoUpgradeStatus(
    dao,
    userPermissions
  );

  if (!isUpgradeAvailable && !isUpgradeInProgress) {
    return null;
  }

  return (
    <DaoWarning
      content={
        <>
          <div className={styles.title}>Upgrade your DAO to V3</div>
          <div className={styles.text}>
            If you do not upgrade your DAO before May 25th it will be stuck in
            V2. In that case future fixes and features will only be available by
            creating a new DAO and moving your assets.
          </div>
        </>
      }
      control={
        <Button
          className={styles.upgradeDaoButton}
          variant="primary"
          onClick={() =>
            router.push({
              pathname: DAO_VERSION_PAGE_URL,
              query: {
                dao: dao.id,
              },
            })
          }
        >
          <Icon name="upgrade" className={styles.upgradeIcon} />
          {isUpgradeInProgress ? 'Upgrade in progress' : 'Upgrade now'}
        </Button>
      }
      className={className}
    />
  );
};
