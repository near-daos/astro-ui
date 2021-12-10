import {
  NotificationSettingsItem,
  NotificationSettingsGroup,
} from 'types/notification';

export const NOTIFICATION_SETTINGS_GROUPS_DATA: NotificationSettingsGroup[] = [
  {
    type: 'platform',
    typeName: 'Platform-wide notifications',
    subtypes: [
      {
        subType: 'root',
      },
    ],
  },
  {
    type: 'my',
    typeName: 'My DAOs and My Activity',
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

export const NOTIFICATION_SETTINGS_DATA: NotificationSettingsItem[] = [
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
