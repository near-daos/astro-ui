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
  subtypes: NotificationSettingsSubType[];
}
