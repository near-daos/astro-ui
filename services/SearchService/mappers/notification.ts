import { AccountNotificationIndex } from 'services/SearchService/types';
import { Notification } from 'types/notification';
import { DAO } from 'types/dao';
import { isToday } from 'date-fns';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';

export function mapAccountNotificationIndexToNotification(
  index: AccountNotificationIndex
): Notification {
  const {
    accountId,
    isRead,
    isMuted,
    isArchived,
    creatingTimeStamp,
    notification,
    id,
    dao,
    daoId,
  } = index;

  const { type, signerId, metadata, targetId, status } = notification;
  const date = new Date(creatingTimeStamp);

  return {
    id,
    accountId,
    isNew: isToday(date),
    isRead,
    isMuted,
    isArchived,
    dao: {
      flagCover: getAwsImageUrl(dao.metadata.flagCover),
      flagLogo: getAwsImageUrl(dao.metadata.flagLogo),
    } as DAO,
    daoId,
    signerId,
    targetId,
    type,
    metadata,
    createdAt: index.creatingTimeStamp
      ? new Date(index.creatingTimeStamp).toISOString()
      : '',
    isMuteAvailable: false,
    isMarkReadAvailable: true,
    isDeleteAvailable: false,
    status,
  };
}
