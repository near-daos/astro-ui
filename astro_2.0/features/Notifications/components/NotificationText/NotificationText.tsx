import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { NotifiedActionType } from 'types/notification';
import { DAO } from 'types/dao';
import { DaoCreateNotificationMetadata } from 'astro_2.0/features/Notifications/types';

import { extractPrefix } from 'astro_2.0/features/Notifications/helpers';

import styles from './NotificationText.module.scss';

interface NotificationTextProps {
  accountId: string;
  proposerId: string;
  type: NotifiedActionType;
  metadata: unknown;
  dao: DAO | null;
}

export const NotificationText: FC<NotificationTextProps> = ({
  accountId,
  proposerId,
  type,
  metadata,
  dao,
}) => {
  const { t } = useTranslation('notificationsPage');
  let action;

  // todo -add fallback?
  if (!dao) return null;

  switch (type) {
    case NotifiedActionType.CustomDaoCreation:
    case NotifiedActionType.ClubDaoCreation:
    case NotifiedActionType.FoundationDaoCreation:
    case NotifiedActionType.CorporationDaoCreation:
    case NotifiedActionType.CooperativeDaoCreation: {
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
    case NotifiedActionType.BountyProposalCreation: {
      const actioner =
        accountId === proposerId ? 'You' : extractPrefix(accountId);

      action = (
        <>
          <span className={styles.actioner}>{actioner}</span> proposed a new
          bounty to {dao.displayName || extractPrefix(dao.id)}
        </>
      );
      break;
    }
    case NotifiedActionType.BountyDoneProposalCreation:
    case NotifiedActionType.TransferProposalCreation: {
      const actioner =
        accountId === proposerId ? 'You' : extractPrefix(accountId);

      action = (
        <>
          <span className={styles.actioner}>{actioner}</span>{' '}
          {t('submittedNewProposal', {
            dao: dao.displayName || extractPrefix(dao.id),
          })}
        </>
      );
      break;
    }
    case NotifiedActionType.PollProposalCreation: {
      const actioner =
        accountId === proposerId ? 'You' : extractPrefix(accountId);

      action = (
        <>
          <span className={styles.actioner}>{actioner}</span>{' '}
          {t('createdNewPoll', {
            dao: dao.displayName || extractPrefix(dao.id),
          })}
        </>
      );

      break;
    }
    case NotifiedActionType.DaoNameUpdated: {
      const actioner = accountId === proposerId ? 'Your' : accountId;

      action = (
        <>
          <span className={styles.actioner}>{actioner}</span>
          {t('proposalChangeNameSuccess')}
        </>
      );
      break;
    }

    default: {
      action = '';
    }
  }

  return <div className={styles.root}>{action}</div>;
};
