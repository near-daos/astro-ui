import {
  NotificationDTO,
  Notification,
  NotificationStatus,
} from 'types/notification';
import { mapDaoDTOtoDao } from 'services/sputnik/mappers';

export function mapNotificationDtoToNotification(
  notifications: NotificationDTO[]
): Notification[] {
  return notifications.map(
    ({ accountId, isRead, isMuted, isArchived, createdAt, notification }) => {
      const {
        id,
        type,
        signerId,
        metadata,
        targetId,
        dao,
        daoId,
      } = notification;

      return {
        id,
        accountId,
        isNew: isRead,
        isRead,
        isMuted,
        isArchived,
        dao: mapDaoDTOtoDao(dao),
        status: NotificationStatus.Default,
        daoId,
        signerId,
        targetId,
        type,
        metadata,
        createdAt: new Date(createdAt).toISOString(),
        isMuteAvailable: false,
        isMarkReadAvailable: true,
        isDeleteAvailable: false,
      };
    }
  );
}
