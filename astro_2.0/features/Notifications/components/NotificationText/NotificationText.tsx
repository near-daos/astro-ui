import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { NotificationStatus, NotifiedActionType } from 'types/notification';
import { DAO } from 'types/dao';
import { DaoCreateNotificationMetadata } from 'astro_2.0/features/Notifications/types';

import {
  extractPrefix,
  generateProposalNotificationText,
} from 'astro_2.0/features/Notifications/helpers';

import styles from './NotificationText.module.scss';

interface NotificationTextProps {
  accountId: string;
  proposerId: string;
  type: NotifiedActionType;
  metadata: unknown;
  dao: DAO | null;
  status: NotificationStatus;
  signerId: string | null;
}

export const NotificationText: FC<NotificationTextProps> = ({
  accountId,
  proposerId,
  type,
  metadata,
  status,
  dao,
  signerId,
}) => {
  const { t } = useTranslation('notificationsPage');
  let action;

  // todo -add fallback?
  if (!dao) {
    return null;
  }

  switch (type) {
    case NotifiedActionType.CustomDao:
    case NotifiedActionType.ClubDao:
    case NotifiedActionType.FoundationDao:
    case NotifiedActionType.CorporationDao:
    case NotifiedActionType.CooperativeDao: {
      const newDaoName =
        (metadata as DaoCreateNotificationMetadata)?.args?.name ?? '';

      if (accountId === proposerId) {
        action = t('yourNewDaoCreated', { newDaoName });
      } else {
        action = t('newDaoCreated', {
          newDaoName,
          accountId: extractPrefix(accountId),
        });
      }

      break;
    }
    case NotifiedActionType.AddBounty:
    case NotifiedActionType.BountyDone:
    case NotifiedActionType.Transfer:
    case NotifiedActionType.Vote:
    case NotifiedActionType.AddMemberToRole:
    case NotifiedActionType.RemoveMemberFromRole:
    case NotifiedActionType.FunctionCall:
    case NotifiedActionType.ChangePolicy:
    case NotifiedActionType.ChangeConfig:
    case NotifiedActionType.CommentLike: {
      action = generateProposalNotificationText(
        accountId,
        signerId,
        proposerId,
        status,
        type,
        dao,
        t
      );

      break;
    }

    default: {
      action = '';
    }
  }

  return (
    // eslint-disable-next-line react/no-danger
    <div className={styles.root} dangerouslySetInnerHTML={{ __html: action }} />
  );
};
