import { IconName } from 'components/Icon';
import { IDaoCreateForm } from 'features/create-dao/components/dao-create-form/DaoCreateForm';

export type DAOType = 'club' | 'cooperative' | 'corporation' | 'foundation';
export type Subject = 'proposals' | 'structure' | 'voting';
export type DAOVotingPowerType = 'democratic' | 'weighted';
export type DAOProposalsType = 'open' | 'closed';
export type DAOStructureType = 'flat' | 'groups';

export interface DAOTemplate {
  title: string;
  description: string;
  variant: DAOType;
  proposals: DAOProposalsType;
  structure: DAOStructureType;
  voting: DAOVotingPowerType;
}

export type DaoSettingOption<T> = {
  title: string;
  value: T;
  icon: IconName;
  subject: Subject;
  description: string;
};

export interface DAOFormValues extends IDaoCreateForm {
  proposals: DAOProposalsType;
  structure: DAOStructureType;
  voting: DAOVotingPowerType;
}
