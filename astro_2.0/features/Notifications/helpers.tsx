import isEmpty from 'lodash/isEmpty';
import { UrlObject } from 'url';
import { IconName } from 'components/Icon';
import {
  NotificationSettingsDao,
  NotificationSettingsGroup,
  NotificationSettingsItem,
  NotificationSettingsPlatform,
  NotificationsGroupStatus,
  NotificationStatus,
  NotificationType,
  NotifiedActionType,
} from 'types/notification';
import { NotificationSettingDTO } from 'services/NotificationsService/types';
import uniqid from 'uniqid';
import { DaoSettings } from 'astro_2.0/features/Notifications/types';
import { DAO } from 'types/dao';
import { TFunction } from 'next-i18next';
import {
  DRAFT_PAGE_URL,
  SINGLE_DAO_PAGE,
  SINGLE_PROPOSAL_PAGE_URL,
} from 'constants/routing';

export function getNotificationParamsByType(
  type: NotifiedActionType,
  daoId: string,
  targetId: string,
  status: NotificationStatus
): {
  iconType: IconName;
  url: string | UrlObject;
  statusIcon: IconName | null;
} {
  let noteType;
  let url;
  let statusIcon: IconName | null;

  switch (type) {
    case NotifiedActionType.CustomDao:
    case NotifiedActionType.ClubDao:
    case NotifiedActionType.FoundationDao:
    case NotifiedActionType.CorporationDao:
    case NotifiedActionType.CooperativeDao: {
      noteType = NotificationType.DaoConfig;
      url = {
        pathname: SINGLE_DAO_PAGE,
        query: {
          dao: daoId,
        },
      };

      break;
    }

    case NotifiedActionType.ChangePolicy:
    case NotifiedActionType.ChangeConfig: {
      noteType = NotificationType.DaoConfig;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }
    case NotifiedActionType.AddMemberToRole: {
      noteType = NotificationType.AddMember;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }
    case NotifiedActionType.RemoveMemberFromRole: {
      noteType = NotificationType.RemoveMember;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }
    case NotifiedActionType.AddBounty:
    case NotifiedActionType.BountyDone: {
      noteType = NotificationType.Bounty;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }

    case NotifiedActionType.Transfer: {
      noteType = NotificationType.Transfer;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }
    case NotifiedActionType.FunctionCall: {
      noteType = NotificationType.Transfer;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }

    case NotifiedActionType.Vote: {
      noteType = NotificationType.Polls;
      url = {
        pathname: SINGLE_PROPOSAL_PAGE_URL,
        query: {
          dao: daoId,
          proposal: targetId,
        },
      };

      break;
    }

    case NotifiedActionType.CommentLike: {
      noteType = NotificationType.CommentLike;
      url = {
        pathname: DRAFT_PAGE_URL,
        query: {
          dao: daoId,
          draft: targetId,
        },
      };

      break;
    }

    default: {
      noteType = '';
      url = '';
    }
  }

  switch (status) {
    case NotificationStatus.Approved: {
      statusIcon = 'votingYesChecked';
      break;
    }
    case NotificationStatus.Rejected: {
      statusIcon = 'votingNoChecked';
      break;
    }
    case NotificationStatus.Removed: {
      statusIcon = 'votingDismissChecked';
      break;
    }
    case NotificationStatus.VoteApprove: {
      statusIcon = 'votingYes';
      break;
    }
    case NotificationStatus.VoteReject: {
      statusIcon = 'votingNo';
      break;
    }
    case NotificationStatus.VoteRemove: {
      statusIcon = 'votingDismiss';
      break;
    }
    default: {
      statusIcon = null;
    }
  }

  if (!noteType) {
    return {
      iconType: 'tokenDefaultIcon',
      url,
      statusIcon,
    };
  }

  const iconType =
    noteType !== 'Default'
      ? (`noteType${noteType}` as IconName)
      : (`noteType${noteType}Default` as IconName);

  return {
    iconType,
    url,
    statusIcon,
  };
}

export function extractPrefix(
  value: string | null,
  delimiter?: string
): string {
  if (!value) {
    return '';
  }

  return value.substring(0, value.indexOf(delimiter ?? '.'));
}

export const PLATFORM_RELATED_SETTINGS = [
  NotifiedActionType.CustomDao,
  NotifiedActionType.ClubDao,
  NotifiedActionType.FoundationDao,
  NotifiedActionType.CooperativeDao,
  NotifiedActionType.CorporationDao,
];

export const DAO_RELATED_SETTINGS = [
  NotifiedActionType.AddMemberToRole,
  NotifiedActionType.RemoveMemberFromRole,
  NotifiedActionType.FunctionCall,
  NotifiedActionType.Transfer,
  NotifiedActionType.ChangePolicy,
  NotifiedActionType.ChangeConfig,
  NotifiedActionType.AddBounty,
  NotifiedActionType.BountyDone,
  NotifiedActionType.Vote,
];

export function prepareSettingsPlatform(
  settings: NotificationSettingDTO[],
  t: TFunction
): NotificationSettingsPlatform {
  const enabledTypes =
    !settings || isEmpty(settings)
      ? new Set(PLATFORM_RELATED_SETTINGS)
      : new Set(settings[0].types);

  return {
    id: 'platform',
    name: t('platformWideNotifications'),
    text: t('howLongDisable'),
    status: settings[0]?.isAllMuted
      ? NotificationsGroupStatus.Disable
      : NotificationsGroupStatus.Enabled,
    settings: [
      {
        id: uniqid(),
        notificationType: NotifiedActionType.CustomDao,
        checked: enabledTypes.has(NotifiedActionType.CustomDao),
        title: t('customDaoCreate'),
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.ClubDao,
        checked: enabledTypes.has(NotifiedActionType.ClubDao),
        title: t('clubDaoCreate'),
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.FoundationDao,
        checked: enabledTypes.has(NotifiedActionType.FoundationDao),
        title: t('foundationDaoCreate'),
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.CorporationDao,
        checked: enabledTypes.has(NotifiedActionType.CorporationDao),
        title: t('corporationDaoCreate'),
      },
      {
        id: uniqid(),
        notificationType: NotifiedActionType.CooperativeDao,
        checked: enabledTypes.has(NotifiedActionType.CooperativeDao),
        title: t('cooperativeDaoCreate'),
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
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.AddMemberToRole),
      notificationType: NotifiedActionType.AddMemberToRole,
      type: 'member',
      title: 'Notify me about Add member to role',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.RemoveMemberFromRole),
      type: 'member',
      notificationType: NotifiedActionType.RemoveMemberFromRole,
      title: 'Notify me about Remove member from role',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.FunctionCall),
      type: 'transfer',
      notificationType: NotifiedActionType.FunctionCall,
      title: 'Notify me about Function call',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.Transfer),
      type: 'transfer',
      notificationType: NotifiedActionType.Transfer,
      title: 'Notify me about Transfer',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.ChangePolicy),
      type: 'config',
      notificationType: NotifiedActionType.ChangePolicy,
      title: 'Notify me about Change Policy',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.ChangeConfig),
      type: 'config',
      notificationType: NotifiedActionType.ChangeConfig,
      title: 'Notify me about Change Config',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.AddBounty),
      type: 'bounty',
      notificationType: NotifiedActionType.AddBounty,
      title: 'Notify me about Add Bounty',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.BountyDone),
      type: 'bounty',
      notificationType: NotifiedActionType.BountyDone,
      title: 'Notify me about Bounty Done',
    },
    {
      id: uniqid(),
      checked: enabledTypes.has(NotifiedActionType.Vote),
      notificationType: NotifiedActionType.Vote,
      type: 'poll',
      title: 'Notify me about Poll',
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
    text: 'Choose for how long you would like to disable notifications from your DAOs and DAOs you are a member.',
    status:
      myDaosSettings.filter(item => !item.settings?.isAllMuted).length > 0
        ? NotificationsGroupStatus.Enabled
        : NotificationsGroupStatus.Disable,
    daos: myDaosSettings.map(daoSettings => generateDaoNode(daoSettings)),
  };

  const subscribedDaosGroup = {
    groupId: 'subscribed',
    groupName: 'Subscribed DAOs',
    text: 'Choose for how long you would like to disable notifications from your subscribed DAOs.',
    status:
      subscribedDaosSettings.filter(item => !item.settings?.isAllMuted).length >
      0
        ? NotificationsGroupStatus.Enabled
        : NotificationsGroupStatus.Disable,
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

const mapNotificationTypeToMessage = (
  type: NotifiedActionType,
  t: TFunction
) => {
  switch (type) {
    case NotifiedActionType.AddMemberToRole: {
      return t('addMemberToGroup');
    }
    case NotifiedActionType.RemoveMemberFromRole: {
      return t('removeMemberFromGroup');
    }
    case NotifiedActionType.AddBounty: {
      return t('createBounty');
    }
    case NotifiedActionType.BountyDone: {
      return t('bountyDone');
    }
    case NotifiedActionType.ChangeConfig: {
      return t('changeConfig');
    }
    case NotifiedActionType.ChangePolicy: {
      return t('changePolicy');
    }
    case NotifiedActionType.Transfer: {
      return t('transfer');
    }
    case NotifiedActionType.FunctionCall: {
      return t('functionCall');
    }
    case NotifiedActionType.Vote: {
      return t('poll');
    }
    case NotifiedActionType.CommentLike: {
      return t('commentLike');
    }
    default: {
      return '';
    }
  }
};

export function generateProposalNotificationText(
  accountId: string,
  signerId: string | null,
  proposerId: string,
  status: NotificationStatus,
  notificationType: NotifiedActionType,
  dao: DAO,
  t: TFunction
): string {
  const type = mapNotificationTypeToMessage(notificationType, t);

  switch (status) {
    case NotificationStatus.Created: {
      const actioner =
        accountId === proposerId ? t('you') : extractPrefix(proposerId);

      return `<b>${actioner}</b> ${t('submittedNewProposal', {
        type,
        dao: dao.displayName || extractPrefix(dao.id),
      })}`;
    }
    case NotificationStatus.Rejected: {
      const actioner =
        accountId === proposerId ? t('your') : extractPrefix(proposerId);

      return `<b>${actioner}'s</b> "${type}" ${t('proposalWasRejected', {
        dao: dao.displayName || extractPrefix(dao.id),
      })}`;
    }
    case NotificationStatus.Approved: {
      const actioner =
        accountId === proposerId ? t('your') : extractPrefix(proposerId);

      return `<b>${actioner}'s</b> "${type}" ${t('proposalWasApproved', {
        dao: dao.displayName || extractPrefix(dao.id),
      })}`;
    }
    case NotificationStatus.VoteApprove: {
      const actioner =
        accountId === signerId ? t('you') : extractPrefix(signerId);

      const proposalAuthor =
        accountId === proposerId ? t('your') : extractPrefix(proposerId);

      return t('votedToApprove', {
        actioner,
        proposalAuthor,
        type,
        dao: dao.displayName || extractPrefix(dao.id),
      });
    }
    case NotificationStatus.VoteReject: {
      const actioner =
        accountId === signerId ? t('you') : extractPrefix(signerId);

      const proposalAuthor =
        accountId === proposerId ? t('your') : extractPrefix(proposerId);

      return t('votedToReject', {
        actioner,
        proposalAuthor,
        type,
        dao: dao.displayName || extractPrefix(dao.id),
      });
    }
    case NotificationStatus.VoteRemove: {
      const actioner =
        accountId === signerId ? t('you') : extractPrefix(signerId);

      const proposalAuthor =
        accountId === proposerId ? t('your') : extractPrefix(proposerId);

      return t('votedToRemove', {
        actioner,
        proposalAuthor,
        type,
        dao: dao.displayName || extractPrefix(dao.id),
      });
    }
    case NotificationStatus.CommentLike: {
      const actioner =
        accountId === signerId ? t('you') : extractPrefix(signerId);

      const proposalAuthor =
        accountId === proposerId ? t('your') : extractPrefix(proposerId);

      return t('liked', {
        actioner,
        proposalAuthor,
      });
    }
    default: {
      return `Proposal updated in the ${
        dao.displayName || extractPrefix(dao.id)
      } DAO`;
    }
  }
}
