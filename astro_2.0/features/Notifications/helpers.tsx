import isEmpty from 'lodash/isEmpty';
import { IconName } from 'components/Icon';
import {
  NotificationSettingsDao,
  NotificationSettingsGroup,
  NotificationSettingsItem,
  NotificationSettingsPlatform,
  NotificationsGroupStatus,
  NotificationType,
  NotifiedActionType,
} from 'types/notification';
import { NotificationSettingDTO } from 'services/NotificationsService/types';
import uniqid from 'uniqid';
import { DaoSettings } from 'astro_2.0/features/Notifications/types';

export function getNotificationParamsByType(
  type: NotifiedActionType,
  daoId: string,
  targetId: string
): {
  iconType: IconName;
  url: string;
} {
  let noteType;
  let url;

  switch (type) {
    case NotifiedActionType.CustomDaoCreation:
    case NotifiedActionType.ClubDaoCreation:
    case NotifiedActionType.FoundationDaoCreation:
    case NotifiedActionType.CorporationDaoCreation:
    case NotifiedActionType.CooperativeDaoCreation:
    case NotifiedActionType.DaoNameUpdated: {
      noteType = NotificationType.DaoConfig;
      url = `/dao/${targetId}`;

      break;
    }
    case NotifiedActionType.BountyDoneProposalCreation:
    case NotifiedActionType.BountyProposalCreation: {
      noteType = NotificationType.Bounty;
      url = `/dao/${daoId}/proposals/${targetId}`;

      break;
    }

    case NotifiedActionType.TransferProposalCreation: {
      noteType = NotificationType.Transfer;
      url = `/dao/${daoId}/proposals/${targetId}`;

      break;
    }
    case NotifiedActionType.PollProposalCreation: {
      noteType = NotificationType.Polls;
      url = `/dao/${daoId}/proposals/${targetId}`;

      break;
    }

    default: {
      noteType = '';
      url = '';
    }
  }

  const iconType =
    noteType !== 'Default'
      ? (`noteType${noteType}` as IconName)
      : (`noteType${noteType}Default` as IconName);

  return {
    iconType,
    url,
  };
}

export function extractPrefix(value: string, delimiter?: string): string {
  if (!value) return '';

  return value.substring(0, value.indexOf(delimiter ?? '.'));
}

const PLATFORM_RELATED_SETTINGS = [
  NotifiedActionType.CustomDaoCreation,
  NotifiedActionType.ClubDaoCreation,
  NotifiedActionType.FoundationDaoCreation,
  NotifiedActionType.CooperativeDaoCreation,
  NotifiedActionType.CorporationDaoCreation,
];

const DAO_RELATED_SETTINGS = [
  NotifiedActionType.TransferProposalCreation,

  NotifiedActionType.BountyProposalCreation,
  NotifiedActionType.BountyDoneProposalCreation,

  NotifiedActionType.PollProposalCreation,

  NotifiedActionType.DaoNameUpdated,
  NotifiedActionType.DaoPurposeUpdated,
  NotifiedActionType.DaoLegalUpdated,
  NotifiedActionType.DaoLinksUpdated,
  NotifiedActionType.DaoFlagUpdated,
  NotifiedActionType.DaoDeadlinesUpdated,
  NotifiedActionType.DaoRulesUpdated,
  NotifiedActionType.DaoGroupAdded,
  NotifiedActionType.DaoGroupUpdated,
  NotifiedActionType.DaoGroupRemoved,
  NotifiedActionType.DaoMembersAdded,
  NotifiedActionType.DaoMemberRemoved,
];

export function prepareSettingsPlatform(
  settings: NotificationSettingDTO[]
): NotificationSettingsPlatform {
  const enabledTypes =
    !settings || isEmpty(settings)
      ? new Set(PLATFORM_RELATED_SETTINGS)
      : new Set(settings[0].types);

  return {
    id: 'platform',
    name: 'Platform-wide notifications',
    text:
      'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
    status: settings[0].isAllMuted
      ? NotificationsGroupStatus.Disable
      : NotificationsGroupStatus.Enabled,
    settings: [
      {
        id: uniqid(),
        notificationType: NotifiedActionType.CustomDaoCreation,
        checked: enabledTypes.has(NotifiedActionType.CustomDaoCreation),
        title: 'Notify me about the creation of a DAO',
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.ClubDaoCreation,
        checked: enabledTypes.has(NotifiedActionType.ClubDaoCreation),
        title: 'Notify me about the creation of a DAO with a Club Structure',
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.FoundationDaoCreation,
        checked: enabledTypes.has(NotifiedActionType.FoundationDaoCreation),
        title:
          'Notify me about the creation of a DAO with a Foundation Structure',
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.CorporationDaoCreation,
        checked: enabledTypes.has(NotifiedActionType.CorporationDaoCreation),
        title:
          'Notify me about the creation of a DAO with a Corporation Structure',
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.CooperativeDaoCreation,
        checked: enabledTypes.has(NotifiedActionType.CooperativeDaoCreation),
        title:
          'Notify me about the creation of a DAO with a Cooperative Structure',
      },
    ],
  };
}

const generateSettings = (
  settings: NotificationSettingDTO
): NotificationSettingsItem[] => {
  const enabledTypes =
    !settings || isEmpty(settings)
      ? new Set(DAO_RELATED_SETTINGS)
      : new Set(settings.types);

  return [
    // {
    //   id: uniqid(),
    //   checked: true,
    //   type: 'root',
    //   title: 'Notify me about new proposals',
    // },
    // {
    //   id: uniqid(),
    //   checked: false,
    //   type: 'root',
    //   title: 'Notify me about approved/rejected proposals',
    // },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.BountyProposalCreation),
      notificationType: NotifiedActionType.BountyProposalCreation,
      type: 'bounty',
      title: 'Notify me about bounties proposed',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.BountyDoneProposalCreation),
      type: 'bounty',
      notificationType: NotifiedActionType.BountyDoneProposalCreation,
      title: 'Notify me about new payout initiations',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.TransferProposalCreation),
      type: 'bounty',
      notificationType: NotifiedActionType.TransferProposalCreation,
      title: 'Notify me about raised funds for transfer/creation of a bounty',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoNameUpdated),
      type: 'config',
      notificationType: NotifiedActionType.DaoNameUpdated,
      title: 'Notify me about updated DAO name',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoPurposeUpdated),
      type: 'config',
      notificationType: NotifiedActionType.DaoPurposeUpdated,
      title: 'Notify me about updated DAO purpose',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoLegalUpdated),
      type: 'config',
      notificationType: NotifiedActionType.DaoLegalUpdated,
      title: 'Notify me about updated DAO legal status and document',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoLinksUpdated),
      type: 'config',
      notificationType: NotifiedActionType.DaoLinksUpdated,
      title: 'Notify me about updated DAO links',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoFlagUpdated),
      type: 'config',
      notificationType: NotifiedActionType.DaoFlagUpdated,
      title: 'Notify me about updated flag and logo',
    },
    // {
    //   id: uniqid(),
    //   checked: true,
    //   type: 'config',
    //   title: 'Notify me about updated Group name',
    // },
    // {
    //   id: uniqid(),
    //   checked: enabledTypes.has(NotifiedActionType.DaoRulesUpdated),
    //   type: 'policy',
    //   title: 'Notify me about updated voting policy settings',
    // },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoDeadlinesUpdated),
      notificationType: NotifiedActionType.DaoDeadlinesUpdated,
      type: 'policy',
      title: 'Notify me about updated bonds and deadlines',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoGroupAdded),
      type: 'policy',
      notificationType: NotifiedActionType.DaoGroupAdded,
      title: 'Notify me about new groups',
    },
    // {
    //   id: uniqid(),
    //   checked: true,
    //   type: 'policy',
    //   title: 'Notify me about a group being removed',
    // },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoRulesUpdated),
      type: 'policy',
      notificationType: NotifiedActionType.DaoRulesUpdated,
      title: 'Notify me about updated DAO rules (structure)',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoMembersAdded),
      type: 'member',
      notificationType: NotifiedActionType.DaoMembersAdded,
      title: 'Notify me about new members of a DAO',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.DaoMemberRemoved),
      type: 'member',
      notificationType: NotifiedActionType.DaoMemberRemoved,
      title: 'Notify me about being removed from a group',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.PollProposalCreation),
      type: 'vote',
      notificationType: NotifiedActionType.PollProposalCreation,
      title: 'Notify me about new polls created',
    },
  ];
};

function generateDaoNode(daoSettings: DaoSettings): NotificationSettingsDao {
  const { dao, settings } = daoSettings;

  return {
    daoId: dao.id,
    daoName: dao.displayName || dao.id,
    daoAddress: dao.id,
    flagCover: dao.flagCover || dao.logo,
    settings: generateSettings(settings),
  };
}

export function prepareSettingsGroups(
  myDaosSettings: DaoSettings[],
  subscribedDaosSettings: DaoSettings[]
): NotificationSettingsGroup[] {
  const myDaosGroup = {
    groupId: 'my',
    groupName: 'My DAOs Notification',
    text:
      'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
    status: NotificationsGroupStatus.Enabled,
    daos: myDaosSettings.map(daoSettings => generateDaoNode(daoSettings)),
  };

  const subscribedDaosGroup = {
    groupId: 'subscribed',
    groupName: 'Subscribed DAOs',
    text:
      'Choose for how long you would like to disable notifications from your subscribed DAOs.',
    status: NotificationsGroupStatus.Disable,
    daos: subscribedDaosSettings.map(daoSettings =>
      generateDaoNode(daoSettings)
    ),
  };

  return [myDaosGroup, subscribedDaosGroup];
}

export function extractTypes(settings: NotificationSettingsItem[]): string[] {
  return settings.reduce<string[]>((res, item) => {
    if (item.checked) {
      res.push(item.notificationType);
    }

    return res;
  }, []);
}

export function mapDelayToTime(delay: string): number {
  switch (delay) {
    case 'OneDay': {
      return 24 * 60 * 60 * 1000;
    }
    case 'OneHour': {
      return 60 * 60 * 1000;
    }
    case 'EightHours': {
      return 8 * 60 * 60 * 1000;
    }
    default: {
      return 0;
    }
  }
}
