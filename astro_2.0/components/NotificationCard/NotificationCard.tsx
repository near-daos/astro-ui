import React, { useCallback, useState } from 'react';
import { useToggle } from 'react-use';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';

import { NotificationCardContent } from 'astro_2.0/components/NotificationCard/types';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { ActionButton } from 'features/proposal/components/action-button';
import { Button } from 'components/button/Button';
import { Icon, IconName } from 'components/Icon';

import styles from './NotificationCard.module.scss';

export interface NotificationCardProps {
  content: NotificationCardContent;
  regular?: boolean;
  isNew: boolean;
  isRead: boolean;
  isMuted: boolean;
  isMuteAvailable: boolean;
  isMarkReadAvailable: boolean;
  isDeleteAvailable: boolean;
  markReadHandler: () => void;
  toggleMuteHandler: () => void;
  deleteHandler: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  content,
  regular = true,
  isNew,
  isRead,
  isMuted,
  isMuteAvailable,
  isMarkReadAvailable,
  isDeleteAvailable,
  markReadHandler,
  toggleMuteHandler,
  deleteHandler,
}) => {
  const { type, status, text, time, flagCover, logo, url } = content;
  const router = useRouter();

  const handleNotificationClick = () => {
    if (url) {
      router.push(url);
    }
  };

  const rootClassName = cn(styles.root, {
    [styles.new]: isNew,
    [styles.hub]: !regular,
  });

  const iconType: IconName =
    status !== 'Default' ? `noteType${type}` : `noteType${type}Default`;

  const [isNotificationRead, setNotificationRead] = useState(isRead);

  const handleMarkReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNotificationRead(true);
    markReadHandler();
  };

  const [isDeleteHovered, setDeleteHovered] = useState(false);

  const onDeleteMouseOver = useCallback(() => {
    setDeleteHovered(true);
  }, []);

  const onDeleteMouseOut = useCallback(() => {
    setDeleteHovered(false);
  }, []);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteHandler();
  };

  const [isSoundMuted, toggleSoundState] = useToggle(isMuted);

  const handleSoundClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleSoundState();
    toggleMuteHandler();
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
      <div className={styles.text}>{text}</div>
      <div className={styles.time}>{format(parseISO(time), 'h:mm aaa')}</div>
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
