export enum GroupFormType {
  CREATE_GROUP,
  ADD_TO_GROUP,
  REMOVE_FROM_GROUP,
}

export interface GroupFormInput {
  groupType: GroupFormType;
  selectedGroup?: string;
  groups: string[];
  name?: string;
  detail?: string;
  externalUrl?: string;
}

export interface IGroupForm {
  group: string;
  memberName: string;
  details: string;
  externalUrl: string;
  voteDetails: string;
}
