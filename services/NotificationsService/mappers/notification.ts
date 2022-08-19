import { NotificationDTO, Notification } from 'types/notification';
import { mapDaoDTOtoDao } from 'services/sputnik/mappers';
import { isToday } from 'date-fns';

export function mapNotificationDtoToNotification(
  notifications: NotificationDTO[]
): Notification[] {
  return notifications.map(
    ({
      accountId,
      isRead,
      isMuted,
      isArchived,
      createdAt,
      notification,
      id,
    }) => {
      const { type, signerId, metadata, targetId, dao, daoId, status } =
        notification;
      const date = new Date(createdAt);

      return {
        id,
        accountId,
        isNew: isToday(date),
        isRead,
        isMuted,
        isArchived,
        dao: mapDaoDTOtoDao(dao),
        status,
        daoId,
        signerId,
        targetId,
        type,
        metadata,
        createdAt:
          createdAt && date && date.toISOString ? date.toISOString() : '',
        isMuteAvailable: false,
        isMarkReadAvailable: true,
        isDeleteAvailable: false,
      };
    }
  );
}
