import { DAO } from 'types/dao';
import { DaoDTO, ProposalDTO } from 'services/sputnik/mappers';

export enum NotificationType {
  DaoConfig = 'DaoConfig',
  Bounty = 'Bounty',
  Polls = 'Polls',
  Transfer = 'Transfer',
  AddMember = 'AddMember',
  RemoveMember = 'RemoveMember',
  Governance = 'Governance',
  CommentLike = 'CommentLike',
}

export enum NotificationStatus {
  Created = 'Created',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Removed = 'Removed',
  VoteApprove = 'VoteApprove',
  VoteReject = 'VoteReject',
  VoteRemove = 'VoteRemove',
  CommentLike = 'CommentLike',
}

export enum NotificationsGroupStatus {
  Enabled = 'Enabled',
  OneHour = '1 hour',
  EightHours = '8 hours',
  OneDay = '24 hours',
  Disable = 'Disable',
}

export interface NotificationSettingsType {
  typeId: string;
  typeName?: string;
}

export interface NotificationSettingsItem {
  id: string;
  title: string;
  checked: boolean;
  type?: string;
  notificationType: NotifiedActionType;
}

export interface NotificationSettingsDao {
  daoId: string;
  daoName: string;
  daoAddress: string;
  flagCover?: string;
  flagBack?: string;
  settings: NotificationSettingsItem[];
}

export interface NotificationSettingsGroup {
  groupId: string;
  groupName: string;
  text: string;
  status: NotificationsGroupStatus;
  daos?: NotificationSettingsDao[];
}

export interface NotificationSettingsPlatform {
  id: string;
  name: string;
  text: string;
  status: NotificationsGroupStatus;
  settings: NotificationSettingsItem[];
}

export interface NotificationDisableOption {
  value: string;
  label: NotificationsGroupStatus;
}

export enum NotifiedActionType {
  CustomDao = 'CustomDao',
  ClubDao = 'ClubDao',
  FoundationDao = 'FoundationDao',
  CorporationDao = 'CorporationDao',
  CooperativeDao = 'CooperativeDao',

  AddMemberToRole = 'AddMemberToRole',
  RemoveMemberFromRole = 'RemoveMemberFromRole',
  FunctionCall = 'FunctionCall',
  Transfer = 'Transfer',
  ChangePolicy = 'ChangePolicy',
  ChangeConfig = 'ChangeConfig',
  AddBounty = 'AddBounty',
  BountyDone = 'BountyDone',
  Vote = 'Vote',

  CommentLike = 'CommentLike',

  // TransferProposalCreation = 'TransferProposalCreation',
  // BountyProposalCreation = 'BountyProposalCreation',
  // BountyDoneProposalCreation = 'BountyDoneProposalCreation',
  // PollProposalCreation = 'PollProposalCreation',
  // DaoNameUpdated = 'DaoNameUpdated',
  // DaoPurposeUpdated = 'DaoPurposeUpdated',
  // DaoLegalUpdated = 'DaoLegalUpdated',
  // DaoLinksUpdated = 'DaoLinksUpdated',
  // DaoFlagUpdated = 'DaoFlagUpdated',
  // DaoDeadlinesUpdated = 'DaoDeadlinesUpdated',
  // DaoRulesUpdated = 'DaoRulesUpdated',
  // DaoGroupAdded = 'DaoGroupAdded',
  // DaoGroupUpdated = 'DaoGroupUpdated',
  // DaoGroupRemoved = 'DaoGroupRemoved',
  // DaoMembersAdded = 'DaoMembersAdded',
  // DaoMemberRemoved = 'DaoMemberRemoved',
}

export type NotificationMetadata = {
  methodName: 'act_proposal' | 'add_proposal';
  args: unknown;
  proposal: Pick<
    ProposalDTO,
    'id' | 'proposer' | 'description' | 'kind' | 'votes'
  >;
};

export type NotificationDTO = {
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  notificationId: string;
  accountId: string;
  isMuted: boolean;
  isRead: boolean;
  notification: {
    proposerId: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    signerId: string | null;
    dao: DaoDTO;
    id: string;
    daoId: string;
    targetId: string;
    type: NotifiedActionType;
    metadata: NotificationMetadata;
    timestamp: string;
    status: NotificationStatus;
  };
};

export type Notification = {
  id: string;
  accountId: string;
  isNew: boolean;
  isRead: boolean;
  isMuted: boolean;
  isArchived: boolean;
  dao: DAO | null;
  daoId: string;
  signerId: string | null;
  targetId: string;
  type: NotifiedActionType;
  metadata: NotificationMetadata;
  createdAt: string;
  isMuteAvailable: boolean;
  isMarkReadAvailable: boolean;
  isDeleteAvailable: boolean;
  status: NotificationStatus;
};

export type UpdateNotificationsParams = {
  accountId: string;
  publicKey: string;
  signature: string;
};

export type UpdateNotificationParams = {
  isMuted: boolean;
  isRead: boolean;
  isArchived: boolean;
} & UpdateNotificationsParams;

export type UpdateNotificationSettingsParams = {
  daoId: string | null;
  types: string[];
  mutedUntilTimestamp: string;
  isAllMuted: boolean;
  enableSms: boolean;
  enableEmail: boolean;
} & UpdateNotificationsParams;
