import uniqid from 'uniqid';
import {
  NotificationSettingsItemOld,
  NotificationSettingsGroupOld,
  NotificationsGroupStatus,
  NotificationSettingsGroup,
  NotificationSettingsType,
} from 'types/notification';

const randomBoolean = () => {
  return Math.random() < 0.5;
};

const generateSettings = () => {
  return [
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'root',
      title: 'Notify me about new proposals',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'root',
      title: 'Notify me about approved/rejected proposals',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'bounty',
      title: 'Notify me about bounties proposed',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'bounty',
      title: 'Notify me about new payout initiations',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'bounty',
      title: 'Notify me about raised funds for transfer/creation of a bounty',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'config',
      title: 'Notify me about updated DAO name',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'config',
      title: 'Notify me about updated DAO purpose',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'config',
      title: 'Notify me about updated DAO legal status and document',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'config',
      title: 'Notify me about updated DAO links',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'config',
      title: 'Notify me about updated flag and logo',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'config',
      title: 'Notify me about updated Group name',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'policy',
      title: 'Notify me about updated voting policy settings',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'policy',
      title: 'Notify me about updated bonds and deadlines',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'policy',
      title: 'Notify me about new groups',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'policy',
      title: 'Notify me about a group being removed',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'policy',
      title: 'Notify me about updated DAO rules (structure)',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'member',
      title: 'Notify me about new members of a DAO',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      type: 'member',
      title: 'Notify me about being removed from a group',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
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
        flagCover:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/Ss1ZxQIqzOO9Hx6MONuja',
        settings: generateSettings(),
      },
      {
        daoId: 'bloodyten-bounty-test',
        daoName: 'bloodyten-bounty-test',
        daoAddress: 'bloodyten-bounty-test.sputnikv2.testnet',
        flagBack:
          'https://sputnik-dao.s3.eu-central-1.amazonaws.com/default.png',
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
  name: 'Platform-wide notifications',
  text:
    'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
  status: NotificationsGroupStatus.Enabled,
  settings: [
    {
      id: uniqid(),
      checked: randomBoolean(),
      title: 'Notify me about the updates of the Astro',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      title: 'Notify me about the creation of a DAO',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      title: 'Notify me about the creation of a DAO with a Club Structure',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      title:
        'Notify me about the creation of a DAO with a Foundation Structure',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
      title:
        'Notify me about the creation of a DAO with a Corporation Structure',
    },
    {
      id: uniqid(),
      checked: randomBoolean(),
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

/* OLD DATA */
export const NOTIFICATION_SETTINGS_GROUPS_DATA_OLD: NotificationSettingsGroupOld[] = [
  {
    type: 'platform',
    typeName: 'Platform-wide notifications',
    typeText:
      'Choose for how long you would like to disable global notifications.',
    typeStatus: NotificationsGroupStatus.Enabled,
    subtypes: [
      {
        subType: 'root',
      },
    ],
  },
  {
    type: 'my',
    typeName: 'My DAOs and My Activity',
    typeText:
      'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
    typeStatus: NotificationsGroupStatus.Disable,
    subtypes: [
      {
        subType: 'root',
      },
      {
        subType: 'bounty',
        subTypeName: 'Transfer/Add Bounty',
      },
      {
        subType: 'config',
        subTypeName: 'Change Config',
      },
      {
        subType: 'policy',
        subTypeName: 'Change Policy',
      },
      {
        subType: 'member',
        subTypeName: 'Add/Remove member to Role',
      },
      {
        subType: 'vote',
        subTypeName: 'Vote',
      },
    ],
  },
];

export const NOTIFICATION_SETTINGS_DATA_OLD: NotificationSettingsItemOld[] = [
  {
    id: 'p01',
    title: 'Notify me about the updates of the Astro',
    checked: false,
    type: 'platform',
    subType: 'root',
  },
  {
    id: 'p02',
    title: 'Notify me about the creation of a DAO',
    checked: true,
    type: 'platform',
    subType: 'root',
  },
  {
    id: 'p03',
    title: 'Notify me about the creation of a DAO with a Club Structure',
    checked: true,
    type: 'platform',
    subType: 'root',
  },
  {
    id: 'p04',
    title: 'Notify me about the creation of a DAO with a Foundation Structure',
    checked: true,
    type: 'platform',
    subType: 'root',
  },
  {
    id: 'p05',
    title: 'Notify me about the creation of a DAO with a Corporation Structure',
    checked: true,
    type: 'platform',
    subType: 'root',
  },
  {
    id: 'p06',
    title: 'Notify me about the creation of a DAO with a Cooperative Structure',
    checked: true,
    type: 'platform',
    subType: 'root',
  },
  {
    id: 'm01',
    title: 'Notify me about new proposals',
    checked: true,
    type: 'my',
    subType: 'root',
  },
  {
    id: 'm02',
    title: 'Notify me about approved/rejected proposals',
    checked: true,
    type: 'my',
    subType: 'root',
  },
  {
    id: 'm03',
    title: 'Notify me about bounties proposed',
    checked: true,
    type: 'my',
    subType: 'bounty',
  },
  {
    id: 'm04',
    title: 'Notify me about new payout initiations',
    checked: true,
    type: 'my',
    subType: 'bounty',
  },
  {
    id: 'm05',
    title: 'Notify me about raised funds for transfer/creation of a bounty',
    checked: true,
    type: 'my',
    subType: 'bounty',
  },
  {
    id: 'm06',
    title: 'Notify me about updated DAO name',
    checked: true,
    type: 'my',
    subType: 'config',
  },
  {
    id: 'm07',
    title: 'Notify me about updated DAO purpose',
    checked: true,
    type: 'my',
    subType: 'config',
  },
  {
    id: 'm08',
    title: 'Notify me about updated DAO legal status and document',
    checked: true,
    type: 'my',
    subType: 'config',
  },
  {
    id: 'm09',
    title: 'Notify me about updated DAO links',
    checked: true,
    type: 'my',
    subType: 'config',
  },
  {
    id: 'm10',
    title: 'Notify me about updated flag and logo',
    checked: true,
    type: 'my',
    subType: 'config',
  },
  {
    id: 'm11',
    title: 'Notify me about updated Group name',
    checked: true,
    type: 'my',
    subType: 'config',
  },
  {
    id: 'm12',
    title: 'Notify me about updated voting policy settings',
    checked: true,
    type: 'my',
    subType: 'policy',
  },
  {
    id: 'm13',
    title: 'Notify me about updated bonds and deadlines',
    checked: true,
    type: 'my',
    subType: 'policy',
  },
  {
    id: 'm14',
    title: 'Notify me about new groups',
    checked: true,
    type: 'my',
    subType: 'policy',
  },
  {
    id: 'm15',
    title: 'Notify me about a group being removed',
    checked: true,
    type: 'my',
    subType: 'policy',
  },
  {
    id: 'm16',
    title: 'Notify me about updated DAO rules (structure)',
    checked: true,
    type: 'my',
    subType: 'policy',
  },
  {
    id: 'm17',
    title: 'Notify me about new members of a DAO',
    checked: true,
    type: 'my',
    subType: 'member',
  },
  {
    id: 'm18',
    title: 'Notify me about being removed from a group',
    checked: true,
    type: 'my',
    subType: 'member',
  },
  {
    id: 'm19',
    title: 'Notify me about new polls created',
    checked: true,
    type: 'my',
    subType: 'vote',
  },
];
