import React, { useCallback, useState } from 'react';
import { useToggle } from 'react-use';
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
  isMuted,
  isRead,
  // isArchived,
  metadata,
  accountId,
  targetId,
  createdAt,
  isDeleteAvailable,
  isMarkReadAvailable,
  isMuteAvailable,
  signerId,
  // id,
  status,
}) => {
  const router = useRouter();
  const { handleRead, handleMute, handleDelete } = useNotifications();

  const [isNotificationRead, setNotificationRead] = useState(isRead);
  const [isDeleteHovered, setDeleteHovered] = useState(false);
  const [isSoundMuted, toggleSoundState] = useToggle(isMuted);

  const { flagCover, logo, id = '' } = dao ?? {};
  const { iconType, url } = getNotificationParamsByType(type, id, targetId);

  const handleNotificationClick = () => {
    if (url) {
      router.push(url);
    }
  };

  const rootClassName = cn(styles.root, {
    [styles.new]: isNew,
    [styles.hub]: !regular,
  });

  const handleMarkReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNotificationRead(true);
    handleRead();
  };

  const onDeleteMouseOver = useCallback(() => {
    setDeleteHovered(true);
  }, []);

  const onDeleteMouseOut = useCallback(() => {
    setDeleteHovered(false);
  }, []);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDelete();
  };

  const handleSoundClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleSoundState();
    handleMute();
  };

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
            <Icon name={iconType} width={24} />
            {status !== 'Default' && (
              <div className={styles.status}>
                <Icon name={`noteStatus${status}`} width={12} />
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
          metadata={metadata}
          proposerId={signerId ?? ''}
        />
      </div>
      <div className={styles.time}>
        {format(parseISO(createdAt), 'h:mm aaa')}
      </div>
      <div className={styles.control}>
        <div className={styles.markRead}>
          {isMarkReadAvailable && !isNotificationRead && (
            <Button
              variant="transparent"
              size="block"
              onClick={e => handleMarkReadClick(e)}
              className={styles.markReadButton}
            >
              <Icon
                name="noteCheck"
                width={16}
                className={styles.markReadIcon}
              />
              Mark read
            </Button>
          )}
        </div>
        {isNotificationRead && (
          <div
            onMouseOver={onDeleteMouseOver}
            onMouseOut={onDeleteMouseOut}
            onFocus={onDeleteMouseOver}
            onBlur={onDeleteMouseOut}
          >
            {isDeleteAvailable ? (
              <ActionButton
                size="medium"
                iconName={
                  isDeleteHovered ? 'noteDeleteHover' : 'noteDeleteDefault'
                }
                tooltip="Delete"
                onClick={e => handleDeleteClick(e)}
                className={styles.deleteIcon}
              />
            ) : (
              <ActionButton
                size="medium"
                iconName="noteDeleteDisabled"
                className={styles.deleteIcon}
                disabled
              />
            )}
          </div>
        )}
        {!isNotificationRead && (
          <div>
            {isMuteAvailable ? (
              <ActionButton
                size="medium"
                iconName={isSoundMuted ? 'noteSoundMute' : 'noteSoundUnmute'}
                tooltip={isSoundMuted ? 'Unmute' : 'Mute'}
                onClick={e => handleSoundClick(e)}
                className={cn(styles.muteIcon, {
                  [styles.muted]: isSoundMuted,
                })}
              />
            ) : (
              <ActionButton
                size="medium"
                iconName="noteSoundDisabled"
                className={styles.muteIcon}
                disabled
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
