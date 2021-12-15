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
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
    daoId: string;
    targetId: string;
    type: 'PollProposalCreation'; // what types are available
    metadata: unknown; // should we have proper description of the metadata
    timestamp: string;
  };
};
