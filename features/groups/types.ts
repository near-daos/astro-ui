import { BondDetail, VoteDetail } from 'features/types';

export enum GroupFormType {
  CREATE_GROUP,
  ADD_TO_GROUP,
  REMOVE_FROM_GROUP
}

export interface GroupFormInput {
  groupType: GroupFormType;
  voteDetails: VoteDetail[];
  bondDetails: BondDetail;
  selectedGroup?: string;
  groups: string[];
  name?: string;
  detail?: string;
  externalUrl?: string;
}
