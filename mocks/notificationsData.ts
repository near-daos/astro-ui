import uniqid from 'uniqid';
import {
  NotificationsGroupStatus,
  NotificationSettingsGroup,
  NotificationSettingsType,
} from 'types/notification';

const generateSettings = () => {
  return [
    {
      id: uniqid(),
      checked: true,
      type: 'root',
      title: 'Notify me about new proposals',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'root',
      title: 'Notify me about approved/rejected proposals',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'bounty',
      title: 'Notify me about bounties proposed',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'bounty',
      title: 'Notify me about new payout initiations',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'bounty',
      title: 'Notify me about raised funds for transfer/creation of a bounty',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'config',
      title: 'Notify me about updated DAO name',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'config',
      title: 'Notify me about updated DAO purpose',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'config',
      title: 'Notify me about updated DAO legal status and document',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'config',
      title: 'Notify me about updated DAO links',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'config',
      title: 'Notify me about updated flag and logo',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'config',
      title: 'Notify me about updated Group name',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'policy',
      title: 'Notify me about updated voting policy settings',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'policy',
      title: 'Notify me about updated bonds and deadlines',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'policy',
      title: 'Notify me about new groups',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'policy',
      title: 'Notify me about a group being removed',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'policy',
      title: 'Notify me about updated DAO rules (structure)',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'member',
      title: 'Notify me about new members of a DAO',
    },
    {
      id: uniqid(),
      checked: false,
      type: 'member',
      title: 'Notify me about being removed from a group',
    },
    {
      id: uniqid(),
      checked: true,
      type: 'vote',
      title: 'Notify me about new polls created',
    },
  ];
};

export const NOTIFICATION_SETTINGS_GROUPS_DATA: NotificationSettingsGroup[] = [
  {
    groupId: 'my',
    groupName: 'My DAOs Notification',
    text:
      'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
    status: NotificationsGroupStatus.Enabled,
    daos: [
      {
        daoId: 'vhorin-aggregator-v2-2',
        daoName: 'VHorin Aggregator v2 2',
        daoAddress: 'vhorin-aggregator-v2-2.sputnikv2.testnet',
        flagCover:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/Eyl4_eV3UxPYnHZYPovNC',
        settings: generateSettings(),
      },
      {
        daoId: 'legaldao',
        daoName: 'Legal Dao',
        daoAddress: 'legaldao.sputnikv2.testnet',
        flagBack:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
        settings: generateSettings(),
      },
      {
        daoId: 'bloodyten-bounty-test',
        daoName: 'bloodyten-bounty-test',
        daoAddress: 'bloodyten-bounty-test.sputnikv2.testnet',
        flagCover:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/Ss1ZxQIqzOO9Hx6MONuja',
        settings: generateSettings(),
      },
    ],
  },
  {
    groupId: 'subscribed',
    groupName: 'Subscribed DAOs',
    text:
      'Choose for how long you would like to disable notifications from your subscribed DAOs.',
    status: NotificationsGroupStatus.Disable,
    daos: [
      {
        daoId: 'mission-control',
        daoName: 'Mission Control',
        daoAddress: 'mission-control.sputnikv2.testnet',
        flagCover:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/AgBUCrkEyW-cgBYTlUlU4',
        settings: generateSettings(),
      },
      {
        daoId: 'rom-and-gold',
        daoName: 'Rom and Gold',
        daoAddress: 'rom-and-gold.sputnikv2.testnet',
        flagCover:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/UMht9fzX4_X2LQawHt_nB',
        settings: generateSettings(),
      },
      {
        daoId: 'beta-club',
        daoName: 'Beta club',
        daoAddress: 'beta-club.sputnikv2.testnet',
        flagCover:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/K4uuYAGXh6WdM1ibrv2St',
        settings: generateSettings(),
      },
    ],
  },
];

export const NOTIFICATION_SETTINGS_PLATFORM_DATA = {
  id: 'platform',
  name: 'Platform-wide notifications',
  text:
    'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
  status: NotificationsGroupStatus.Enabled,
  settings: [
    {
      id: uniqid(),
      checked: true,
      title: 'Notify me about the updates of the Astro',
    },
    {
      id: uniqid(),
      checked: false,
      title: 'Notify me about the creation of a DAO',
    },
    {
      id: uniqid(),
      checked: true,
      title: 'Notify me about the creation of a DAO with a Club Structure',
    },
    {
      id: uniqid(),
      checked: false,
      title:
        'Notify me about the creation of a DAO with a Foundation Structure',
    },
    {
      id: uniqid(),
      checked: false,
      title:
        'Notify me about the creation of a DAO with a Corporation Structure',
    },
    {
      id: uniqid(),
      checked: true,
      title:
        'Notify me about the creation of a DAO with a Cooperative Structure',
    },
  ],
};

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
