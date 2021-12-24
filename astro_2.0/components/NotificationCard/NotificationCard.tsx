import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';

import { FlagRenderer } from 'astro_2.0/components/Flag';
import { ActionButton } from 'features/proposal/components/action-button';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import {
  getNotificationParamsByType,
  useNotifications,
  NotificationText,
} from 'astro_2.0/features/Notifications';

import { Notification } from 'types/notification';

import styles from './NotificationCard.module.scss';

export type NotificationCardProps = {
  regular?: boolean;
} & Notification;

export const NotificationCard: React.FC<NotificationCardProps> = ({
  regular = true,
  type,
  dao,
  isNew,
  isRead,
  isArchived,
  isMuted,
  metadata,
  accountId,
  targetId,
  createdAt,
  signerId,
  id,
  status,
}) => {
  const router = useRouter();
  const { handleUpdate } = useNotifications();

  const [isNotificationRead, setNotificationRead] = useState(isRead);

  const { flagCover, logo, id: daoId = '' } = dao ?? {};
  const { iconType, url, statusIcon } = getNotificationParamsByType(
    type,
    daoId,
    targetId,
    status
  );

  const rootClassName = cn(styles.root, {
    [styles.new]: isNew,
    [styles.hub]: !regular,
  });

  const handleMarkReadClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setNotificationRead(true);
      handleUpdate(id, { isMuted, isArchived, isRead: true });
    },
    [handleUpdate, id, isArchived, isMuted]
  );

  const handleDeleteClick = useCallback(
    archived => {
      handleUpdate(id, { isMuted, isArchived: archived, isRead });
    },
    [handleUpdate, id, isMuted, isRead]
  );

  const handleNotificationClick = useCallback(
    e => {
      handleMarkReadClick(e);

      if (url) {
        router.push(url);
      }
    },
    [handleMarkReadClick, router, url]
  );

  return (
    <div
      className={rootClassName}
      role="button"
      tabIndex={0}
      onClick={handleNotificationClick}
      onKeyPress={handleNotificationClick}
    >
      <div className={styles.flagContainer}>
        <div className={styles.flagWrapper}>
          <div className={styles.flag}>
            <FlagRenderer flag={flagCover} size="xs" fallBack={logo} />
          </div>
          <div className={styles.type}>
            {!!iconType && <Icon name={iconType} width={24} />}
            {statusIcon && (
              <div className={styles.status}>
                <Icon name={statusIcon} width={12} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.text}>
        <NotificationText
          type={type}
          accountId={accountId}
          dao={dao}
          status={status}
          metadata={metadata}
          proposerId={signerId ?? ''}
        />
      </div>
      <div className={styles.time}>
        {format(parseISO(createdAt), 'h:mm aaa')}
      </div>
      <div className={styles.control}>
        <div className={styles.markRead}>
          <Button
            variant="transparent"
            size="block"
            onClick={e => handleMarkReadClick(e)}
            className={cn(styles.markReadButton, { [styles.read]: isRead })}
          >
            <Icon
              name={isNotificationRead ? 'noteCheckDouble' : 'noteCheck'}
              width={16}
              className={styles.markReadIcon}
            />
            <div className={styles.markReadTitle}>Mark read</div>
          </Button>
        </div>
        {!regular && (
          <ActionButton
            size="medium"
            iconName={isArchived ? 'noteRestore' : 'noteArchive'}
            tooltip={isArchived ? 'Restore' : 'Archive'}
            onClick={e => {
              e.stopPropagation();
              handleDeleteClick(!isArchived);
            }}
            iconClassName={styles.deleteIcon}
          />
        )}
      </div>
    </div>
  );
};
