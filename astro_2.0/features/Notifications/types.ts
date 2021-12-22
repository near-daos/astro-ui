import { DAO } from 'types/dao';
import { NotificationSettingDTO } from 'services/NotificationsService/types';

export type DaoCreateNotificationMetadata = {
  args: {
    name: string;
    args: string;
  };
  methodName: string;
};

export type DaoSettings = {
  dao: DAO;
  settings: NotificationSettingDTO;
};
