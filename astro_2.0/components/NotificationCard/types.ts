import { NotificationType, NotificationStatus } from 'types/notification';

export interface NotificationCardContent {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  text: string;
  time: string;
  flagCover?: string;
  logo?: string;
  url?: string;
}
