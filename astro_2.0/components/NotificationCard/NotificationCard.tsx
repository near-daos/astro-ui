import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';
import { useSwipeable } from 'react-swipeable';
import { useTranslation } from 'next-i18next';

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
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import styles from './NotificationCard.module.scss';

const EMPTY_OBJECT = {};

export type NotificationCardProps = {
  regular?: boolean;
  onMarkRead?: (id: string) => void;
  onRemove?: (id: string) => void;
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
  onMarkRead,
  onRemove,
}) => {
  const router = useRouter();
  const { handleUpdate } = useNotifications();
  const [swipedLeft, setSwipedLeft] = useState(false);
  const { t } = useTranslation('notificationsPage');

  const { flagCover, logo, id: daoId = '' } = dao ?? {};
  const { iconType, url, statusIcon } = getNotificationParamsByType(
    type,
    daoId,
    targetId,
    status
  );

  const contentClassName = cn(styles.content, {
    [styles.new]: isNew,
    [styles.hub]: !regular,
    [styles.swipedLeft]: swipedLeft,
  });

  const handleMarkReadClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (onMarkRead) {
        onMarkRead(id);
      }

      handleUpdate(id, { isMuted, isArchived, isRead: true });
    },
    [handleUpdate, id, isArchived, isMuted, onMarkRead]
  );

  const handleDeleteClick = useCallback(
    async archived => {
      if (onRemove) {
        onRemove(id);
      }

      await handleUpdate(id, { isMuted, isArchived: archived, isRead });
    },
    [handleUpdate, id, isMuted, isRead, onRemove]
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

  const description = metadata?.proposal?.description.split(
    EXTERNAL_LINK_SEPARATOR
  )[0];

  function renderControls() {
    return (
      <>
        <div className={styles.markRead}>
          <Button
            data-testid="mark-read"
            variant="transparent"
            size="block"
            onClick={e => handleMarkReadClick(e)}
            className={cn(styles.markReadButton, { [styles.read]: isRead })}
          >
            <Icon
              name={isRead ? 'noteCheckDouble' : 'noteCheck'}
              width={24}
              className={styles.markReadIcon}
            />
            <div className={styles.markReadTitle}>Mark read</div>
          </Button>
        </div>
        {!regular && (
          <ActionButton
            testId="delete-action-button"
            className={styles.deleteButton}
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
      </>
    );
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipedLeft(true);
    },
    onSwipedRight: () => {
      setSwipedLeft(false);
    },
  });

  const swipeProps = !regular ? handlers : EMPTY_OBJECT;

  return (
    <div className={styles.root}>
      <div
        data-testid="noty-content"
        className={contentClassName}
        role="button"
        tabIndex={0}
        onClick={handleNotificationClick}
        onKeyPress={handleNotificationClick}
        {...swipeProps}
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
            proposerId={signerId ?? metadata?.proposal?.proposer ?? ''}
          />
        </div>
        {description && (
          <div className={styles.description}>
            <div className={styles.descriptionHeader}>{t('description')}:</div>
            <span>{description}</span>
          </div>
        )}
        <div className={styles.time}>
          {format(parseISO(createdAt), 'h:mm aaa')}
        </div>
        <div className={styles.control}>{renderControls()}</div>
      </div>
      <div
        className={cn(styles.mobileActionsPanel, { [styles.open]: swipedLeft })}
      >
        {renderControls()}
      </div>
    </div>
  );
};
