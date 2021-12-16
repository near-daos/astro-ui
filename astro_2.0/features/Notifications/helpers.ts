import map from 'lodash/map';
import { TFunction } from 'next-i18next';
import {
  NotificationDTO,
  NotificationStatus,
  NotificationType,
  NotifiedActionType,
} from 'types/notification';
import { NotificationCardProps } from 'astro_2.0/components/NotificationCard';
import { DaoCreateNotificationMetadata } from 'astro_2.0/features/Notifications/types';

function getNotificationContent(
  accountId: string,
  proposerId: string,
  type: NotifiedActionType,
  metadata: unknown,
  targetId: string,
  daoId: string,
  t: TFunction
) {
  let action;

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
        action = t('newDaoCreated', { newDaoName, accountId });
      }

      break;
    }
    case NotifiedActionType.BountyProposalCreation: {
      const actioner = accountId === proposerId ? 'You' : accountId;

      action = `${actioner} proposed a new bounty to ${daoId}`;
      break;
    }
    case NotifiedActionType.BountyDoneProposalCreation:
    case NotifiedActionType.TransferProposalCreation: {
      const actioner = accountId === proposerId ? 'You' : accountId;

      action = t('submittedNewProposal', { actioner, daoId });
      break;
    }
    case NotifiedActionType.PollProposalCreation: {
      const actioner = accountId === proposerId ? 'You' : accountId;

      action = `${actioner} created a new poll for ${daoId}. Check out now to cast your vote.`;

      break;
    }
    case NotifiedActionType.DaoNameUpdated: {
      const actioner = accountId === proposerId ? 'Your' : accountId;

      action = t('proposalChangeNameSuccess', { actioner });
      break;
    }

    default: {
      action = '';
    }
  }

  return `${action}`;
}

export function notificationDtoToNotificationCardProps(
  notifications: NotificationDTO[],
  regular = true,
  accountId: string,
  t: TFunction
): NotificationCardProps[] {
  return map(notifications, noty => {
    const {
      isRead,
      isMuted,
      id,
      createdAt,
      notification: { type, proposerId, metadata, targetId, daoId },
    } = noty;

    return {
      isNew: isRead,
      isRead,
      isMuted,
      regular,
      content: {
        id,
        type: NotificationType.DaoConfig,
        status: NotificationStatus.Default,
        text: getNotificationContent(
          accountId,
          proposerId,
          type,
          metadata,
          targetId,
          daoId,
          t
        ),
        time: new Date(createdAt).toISOString(),
      },
      isMuteAvailable: false,
      isMarkReadAvailable: false,
      isDeleteAvailable: false,
      markReadHandler: () => {
        // eslint-disable-next-line no-console
        console.log('>>> markReadHandler');
      },
      toggleMuteHandler: () => {
        // eslint-disable-next-line no-console
        console.log('>>> toggleMuteHandler');
      },
      deleteHandler: () => {
        // eslint-disable-next-line no-console
        console.log('>>> deleteHandler');
      },
    };
  });
}
