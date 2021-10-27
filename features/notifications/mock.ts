import { NOTIFICATION_TYPES, NotificationRawData } from './types';

export const notifications: NotificationRawData[] = [
  {
    type: NOTIFICATION_TYPES.INFO,
    tag: 'Yeild aggregator',
    description: 'Additional description and information about copywriting.',
    lifetime: 3000,
  },
  {
    type: NOTIFICATION_TYPES.SUCCESS,
    tag: 'DAO',
    description: 'Detailed link and advice about successful copywriting.',
  },
  {
    type: NOTIFICATION_TYPES.ERROR,
    tag: 'Yeild aggregator',
    description: 'Detailed link and advice about successful copywriting.',
  },
  {
    type: NOTIFICATION_TYPES.WARNING,
    tag: 'DAO',
    description: 'Detailed link and advice about successful copywriting.',
  },
];
