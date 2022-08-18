import cn from 'classnames';
import { VFC } from 'react';
import Link from 'next/link';

import { FEATURE_FLAGS } from 'constants/featureFlags';

import { NotificationsToastsContainer } from 'astro_2.0/components/AppHeader/components/NotificationsBell/components/NotificationsToastsContainer';
import { Icon } from 'components/Icon';

import { useNotificationsCount } from 'astro_2.0/features/Notifications/hooks';
import { kFormatter } from 'utils/format';

import styles from './NotificationsBell.module.scss';

interface NotificationsBellProps {
  className?: string;
}

export const NotificationsBell: VFC<NotificationsBellProps> = ({
  className,
}) => {
  const counter = useNotificationsCount() || 0;

  return FEATURE_FLAGS.NOTIFICATIONS ? (
    <>
      <Link href="/notifications" passHref>
        <div className={cn(styles.root, className)}>
          <Icon
            name="noteBell"
            className={styles.bell}
            data-testid="no-notifications-icon"
          />
          <div
            className={cn(styles.notificationsCount, {
              [styles.visible]: counter > 0,
            })}
          >
            {kFormatter(counter)}
          </div>
        </div>
      </Link>
      <NotificationsToastsContainer />
    </>
  ) : null;
};
