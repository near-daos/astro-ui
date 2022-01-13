import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useHoverDirty } from 'react-use';
import { useRef, VFC } from 'react';
import Link from 'next/link';

import { FEATURE_FLAGS } from 'constants/featureFlags';

import { useAuthContext } from 'context/AuthContext';
import { useNotifications } from 'astro_2.0/features/Notifications';

import { NotificationsToastsContainer } from 'astro_2.0/components/AppHeader/components/NotificationsBell/components/NotificationsToastsContainer';
import { Icon } from 'components/Icon';

import styles from './NotificationsBell.module.scss';

interface NotificationsBellProps {
  className?: string;
}

export const NotificationsBell: VFC<NotificationsBellProps> = ({
  className,
}) => {
  const rootRef = useRef(null);
  const isHovered = useHoverDirty(rootRef);

  const { accountId } = useAuthContext();
  const { notifications } = useNotifications();

  function renderBellIcon() {
    if (
      isEmpty(notifications) ||
      !notifications.filter(item => !item.isRead).length
    ) {
      return (
        <Icon
          name="noteBell"
          className={styles.bell}
          data-testid="no-notifications-icon"
        />
      );
    }

    return (
      <Icon
        className={styles.bell}
        data-testid="notifications-icon"
        name={isHovered ? 'noteBellActiveHover' : 'noteBellActive'}
      />
    );
  }

  return accountId && FEATURE_FLAGS.NOTIFICATIONS ? (
    <>
      <Link href="/notifications" passHref>
        <div className={cn(styles.root, className)} ref={rootRef}>
          {renderBellIcon()}
        </div>
      </Link>
      <NotificationsToastsContainer />
    </>
  ) : null;
};
