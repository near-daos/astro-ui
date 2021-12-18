import { IconName } from 'components/Icon';
import { NotificationType, NotifiedActionType } from 'types/notification';

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
