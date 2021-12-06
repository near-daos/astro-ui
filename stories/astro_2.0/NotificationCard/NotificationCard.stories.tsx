import React from 'react';

import { Meta, Story } from '@storybook/react';
import {
  NotificationCard,
  NotificationCardProps,
} from 'astro_2.0/components/NotificationCard';
import { NotificationStatus, NotificationType } from 'types/notification';

export default {
  title: 'astro_2.0/NotificationCard',
  component: NotificationCard,
  decorators: [
    story => (
      <div style={{ background: '#FAFAFA', maxWidth: 851 }}>{story()}</div>
    ),
  ],
} as Meta;

export const Template: Story<NotificationCardProps> = (args): JSX.Element => (
  <NotificationCard {...args} />
);

Template.storyName = 'NotificationCard';

Template.args = {
  content: {
    id: '',
    type: NotificationType.Polls,
    status: NotificationStatus.Rejected,
    text:
      'Fedorzetff created a new poll for your DAO Ref.finance. Check out now to cast your vote.',
    time: '2021-12-03T10:39:53.955Z',
    flagCover:
      'https://image.freepik.com/free-photo/blue-liquid-marble-background-abstract-flowing-texture-experimental-art_53876-104502.jpg',
    logo: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
    url: '/my/feed',
  },
  variant: 'hub',
  // variant: 'regular',
  isNew: true,
  isRead: false,
  isMuted: false,
  isMuteAvailable: true,
  isMarkReadAvailable: true,
  isDeleteAvailable: true,
  toggleMuteHandler: () => {
    // eslint-disable-next-line no-console
    console.log('Mute/unmute notification');
  },
  markReadHandler: () => {
    // eslint-disable-next-line no-console
    console.log('Mark notification read');
  },
  deleteHandler: () => {
    // eslint-disable-next-line no-console
    console.log('Delete notification');
  },
};
