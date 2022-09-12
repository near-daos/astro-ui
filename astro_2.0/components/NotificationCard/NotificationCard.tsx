import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useSwipeable } from 'react-swipeable';
import { useTranslation } from 'next-i18next';

import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import {
  getNotificationParamsByType,
  NotificationText,
} from 'astro_2.0/features/Notifications';

import { Notification } from 'types/notification';
import { NotificationAction } from 'astro_2.0/features/Notifications/types';
import { DATA_SEPARATOR } from 'constants/common';

import { formatISODate } from 'utils/format';

import styles from './NotificationCard.module.scss';

const EMPTY_OBJECT = {};

export type NotificationCardProps = {
  className?: string;
  regular?: boolean;
  onRemove?: NotificationAction;
  onUpdate?: NotificationAction;
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
  id,
  status,
  onUpdate,
  onRemove,
  className,
  signerId,
}) => {
  const router = useRouter();
  const [swipedLeft, setSwipedLeft] = useState(false);
  const { t } = useTranslation('notificationsPage');

  const { flagLogo, logo, id: daoId = '' } = dao ?? {};
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

      if (onUpdate) {
        onUpdate(id, { isMuted, isArchived, isRead: !isRead });
      }
    },
    [id, isArchived, isMuted, onUpdate, isRead]
  );

  const handleDeleteClick = useCallback(
    async archived => {
      if (onRemove) {
        onRemove(id, { isMuted, isArchived: archived, isRead });
      }
    },
    [id, isMuted, isRead, onRemove]
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

  const description = metadata?.proposal?.description.split(DATA_SEPARATOR)[0];

  function renderControls() {
    return (
      <>
        <Tooltip overlay={isRead ? t('markAsUnread') : t('markAsRead')}>
          <div className={styles.markRead}>
            <Button
              data-testid="mark-read"
              variant="transparent"
              size="block"
              onClick={handleMarkReadClick}
              className={cn(styles.markReadButton, { [styles.read]: isRead })}
            >
              <Icon
                name={isRead ? 'noteCheckDouble' : 'noteCheck'}
                width={24}
                className={styles.markReadIcon}
              />
            </Button>
          </div>
        </Tooltip>
        {!regular && (
          <div className={styles.markRead}>
            <Tooltip overlay={isArchived ? t('restore') : t('archive')}>
              <Button
                data-testid="delete-action-button"
                variant="transparent"
                size="block"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteClick(!isArchived);
                }}
                className={styles.deleteButton}
              >
                <Icon
                  name={isArchived ? 'noteRestore' : 'noteArchive'}
                  width={24}
                  className={styles.deleteIcon}
                />
              </Button>
            </Tooltip>
          </div>
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
    <div className={cn(styles.root, className)}>
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
              <DaoLogo
                size="md"
                src={flagLogo || logo}
                className={styles.logo}
              />
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
            signerId={signerId}
            proposerId={metadata?.proposal?.proposer ?? ''}
          />
        </div>
        {description && (
          <div className={styles.description}>
            <div className={styles.descriptionHeader}>{t('description')}:</div>
            <span>
              {regular && description.length > 250
                ? `${description.substring(0, 250)}...`
                : description}
            </span>
          </div>
        )}
        <div className={styles.time}>
          {createdAt ? formatISODate(createdAt, 'h:mm aaa') : ''}
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
