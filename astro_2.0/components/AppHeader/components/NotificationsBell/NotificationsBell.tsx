import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useHoverDirty } from 'react-use';
import { useRef, useState, VFC } from 'react';

import { FEATURE_FLAGS } from 'constants/featureFlags';

import { useAuthContext } from 'context/AuthContext';
import { useNotifications } from 'astro_2.0/features/Notifications';

import { Icon } from 'components/Icon';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';
import { NotificationsDropdown } from './components/NotificationsDropdown';

import styles from './NotificationsBell.module.scss';

interface NotificationsBellProps {
  className?: string;
}

export const NotificationsBell: VFC<NotificationsBellProps> = ({
  className,
}) => {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const isHovered = useHoverDirty(rootRef);

  const { accountId } = useAuthContext();
  const { notifications } = useNotifications();

  function renderBellIcon() {
    if (
      isEmpty(notifications) ||
      !notifications.filter(item => !item.isRead).length
    ) {
      return <Icon name="noteBell" className={styles.bell} />;
    }

    return (
      <Icon
        name={isHovered ? 'noteBellActiveHover' : 'noteBellActive'}
        className={styles.bell}
      />
    );
  }

  return accountId && FEATURE_FLAGS.NOTIFICATIONS ? (
    <GenericDropdown
      arrow
      arrowClassName={styles.arrow}
      isOpen={open}
      onOpenUpdate={setOpen}
      options={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 24],
            },
          },
        ],
      }}
      parent={
        <div>
          <div className={cn(styles.root, className)} ref={rootRef}>
            {renderBellIcon()}
          </div>
        </div>
      }
    >
      <NotificationsDropdown notifications={notifications} />
    </GenericDropdown>
  ) : null;
};
