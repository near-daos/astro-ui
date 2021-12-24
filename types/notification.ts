import { DAO } from 'types/dao';
import { DaoDTO } from 'services/sputnik/mappers';

export enum NotificationType {
  DaoConfig = 'DaoConfig',
  Bounty = 'Bounty',
  Polls = 'Polls',
  Transfer = 'Transfer',
  AddMember = 'AddMember',
  RemoveMember = 'RemoveMember',
  Governance = 'Governance',
}

export enum NotificationStatus {
  Created = 'Created',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Removed = 'Removed',
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
    metadata: unknown; // should we have proper description of the metadata
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
  metadata: unknown;
  createdAt: string;
  isMuteAvailable: boolean;
  isMarkReadAvailable: boolean;
  isDeleteAvailable: boolean;
  status: NotificationStatus;
};

export type UpdateNotificationParams = {
  accountId: string;
  publicKey: string;
  signature: string;
  isMuted: boolean;
  isRead: boolean;
  isArchived: boolean;
};

export type UpdateNotificationSettingsParams = {
  accountId: string;
  publicKey: string;
  signature: string;
  daoId: string | null;
  types: string[];
  mutedUntilTimestamp: string;
  isAllMuted: boolean;
};
