import { NotifiedActionType } from 'types/notification';

export type NotificationSettingDTO = {
  isArchived: false;
  createdAt: string;
  updatedAt: string;
  id: string;
  accountId: string;
  daoId: string | null;
  types: NotifiedActionType[];
  mutedUntilTimestamp: string;
  isAllMuted: boolean;
};

export type NotificationSettingsResponse = {
  count: number;
  total: number;
  page: number;
  pageCount: number;
  data: NotificationSettingDTO[];
};
