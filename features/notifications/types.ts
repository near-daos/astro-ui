export enum NOTIFICATION_TYPES {
  SUCCESS = 'Success',
  ERROR = 'Error',
  WARNING = 'Warning',
  INFO = 'Info',
}

export interface NotificationRawData {
  type: NOTIFICATION_TYPES;
  description: string;
  tag?: string;
  // in ms
  lifetime?: number;
}

export interface NotificationProps extends NotificationRawData {
  id: string;
  flat?: boolean;
  timestamp: number;
}

export interface ShowNotificationEvent extends CustomEvent {
  detail: NotificationRawData;
}

export interface HideNotificationEvent extends CustomEvent {
  detail: { id: string };
}

export interface HideNotificationByTagEvent extends CustomEvent {
  detail: { tag: string };
}
