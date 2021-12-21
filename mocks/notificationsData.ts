import {
  NotificationsGroupStatus,
  NotificationSettingsType,
} from 'types/notification';

export const NOTIFICATION_SETTINGS_TYPES: NotificationSettingsType[] = [
  {
    typeId: 'root',
  },
  {
    typeId: 'bounty',
    typeName: 'Transfer/Add Bounty',
  },
  {
    typeId: 'config',
    typeName: 'Change Config',
  },
  {
    typeId: 'policy',
    typeName: 'Change Policy',
  },
  {
    typeId: 'member',
    typeName: 'Add/Remove member to Role',
  },
  {
    typeId: 'vote',
    typeName: 'Vote',
  },
];

export const NOTIFICATION_SETTINGS_DISABLE_OPTIONS = [
  {
    value: 'OneHour',
    label: NotificationsGroupStatus.OneHour,
  },
  {
    value: 'EightHours',
    label: NotificationsGroupStatus.EightHours,
  },
  {
    value: 'OneDay',
    label: NotificationsGroupStatus.OneDay,
  },
  {
    value: 'Disable',
    label: NotificationsGroupStatus.Disable,
  },
];
