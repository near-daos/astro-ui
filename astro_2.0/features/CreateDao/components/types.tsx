import { IconName } from 'components/Icon';

export type DAOType = 'club' | 'cooperative' | 'corporation' | 'foundation';
export type Subject = 'proposals' | 'structure' | 'voting';
export type DAOVotingPowerType = 'democratic' | 'weighted';
export type DAOProposalsType = 'open' | 'closed';
export type DAOStructureType = 'flat' | 'groups';
export type DaoImageType = 'flagCover' | 'flagLogo' | 'tokenImage';

export interface DAOTemplate {
  title: string;
  description: string;
  variant: DAOType;
  proposals: DAOProposalsType;
  structure: DAOStructureType;
  voting: DAOVotingPowerType;
  disabled?: boolean;
}

export type DaoSettingOption<T> = {
  title: string;
  value: T;
  icon: IconName;
  subject: Subject;
  description: string;
  disabled?: boolean;
};

export interface IDaoCreateForm {
  address: string;
  displayName: string;
  purpose: string;
  websites: string[];
  flagCover: FileList;
  flagLogo: FileList;
  defaultFlag: string;
}

export interface DAOFormValues extends IDaoCreateForm {
  proposals: DAOProposalsType;
  structure: DAOStructureType;
  voting: DAOVotingPowerType;
  legalStatus?: string;
  legalLink?: string;
  gas: number;
  members: string[];
}

export type DaoSubjectInfo = {
  subject: Subject;
  title: string;
  subTitle: string;
};
