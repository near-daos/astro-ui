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
  Default = 'Default',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Success = 'Success',
  Alert = 'Alert',
  EndingSoon = 'EndingSoon',
}

export enum NotificationsGroupStatus {
  Enabled = 'Enabled',
  OneHour = '1 hour',
  EightHours = '8 hours',
  OneDay = '24 hours',
  Disable = 'Disable',
}

export interface NotificationSettingsItem {
  id: string;
  title: string;
  checked: boolean;
  type: string;
  subType: string;
}

export interface NotificationSettingsSubType {
  subType: string;
  subTypeName?: string;
}

export interface NotificationSettingsGroup {
  type: string;
  typeName: string;
  typeText: string;
  typeStatus: NotificationsGroupStatus;
  subtypes: NotificationSettingsSubType[];
}

export interface NotificationDisableOption {
  value: string;
  label: NotificationsGroupStatus;
}
export enum NotifiedActionType {
  CustomDaoCreation = 'CustomDaoCreation',
  ClubDaoCreation = 'ClubDaoCreation',
  FoundationDaoCreation = 'FoundationDaoCreation',
  CorporationDaoCreation = 'CorporationDaoCreation',
  CooperativeDaoCreation = 'CooperativeDaoCreation',
  TransferProposalCreation = 'TransferProposalCreation',
  BountyProposalCreation = 'BountyProposalCreation',
  BountyDoneProposalCreation = 'BountyDoneProposalCreation',
  PollProposalCreation = 'PollProposalCreation',
  DaoNameUpdated = 'DaoNameUpdated',
  DaoPurposeUpdated = 'DaoPurposeUpdated',
  DaoLegalUpdated = 'DaoLegalUpdated',
  DaoLinksUpdated = 'DaoLinksUpdated',
  DaoFlagUpdated = 'DaoFlagUpdated',
  DaoDeadlinesUpdated = 'DaoDeadlinesUpdated',
  DaoRulesUpdated = 'DaoRulesUpdated',
  DaoGroupAdded = 'DaoGroupAdded',
  DaoGroupUpdated = 'DaoGroupUpdated',
  DaoGroupRemoved = 'DaoGroupRemoved',
  DaoMembersAdded = 'DaoMembersAdded',
  DaoMemberRemoved = 'DaoMemberRemoved',
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
