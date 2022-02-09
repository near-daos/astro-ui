import {
  DAOProposalsType,
  DaoSettingOption,
  DAOStructureType,
  DAOVotingPowerType,
  DaoSubjectInfo,
} from 'astro_2.0/features/CreateDao/components/types';

const DAO_PROPOSALS_OPEN: DaoSettingOption<DAOProposalsType> = {
  value: 'open',
  icon: 'illustrationOpenOrganization',
  subject: 'proposals',
  title: 'daoRulesAll',
  description: 'daoRulesAllDescription',
};

const DAO_PROPOSALS_CLOSED: DaoSettingOption<DAOProposalsType> = {
  value: 'closed',
  icon: 'illustrationMembersOnly',
  subject: 'proposals',
  title: 'daoRulesMembers',
  description: 'daoRulesMembersDescription',
};

const DAO_VOTING_POWER_DEMOCRATIC: DaoSettingOption<DAOVotingPowerType> = {
  value: 'democratic',
  icon: 'illustrationVotePerMember',
  subject: 'voting',
  title: 'daoRulesDemocratic',
  description: 'daoRulesDemocraticDescription',
};

const DAO_VOTING_POWER_TOKEN: DaoSettingOption<DAOVotingPowerType> = {
  value: 'weighted',
  icon: 'illustrationTokenWeighted',
  subject: 'voting',
  title: 'daoRulesTokenWeighted',
  description: 'daoRulesTokenWeightedDescription',
};

const DAO_STRUCTURE_FLAT: DaoSettingOption<DAOStructureType> = {
  value: 'flat',
  icon: 'illustrationFlatOrganization',
  subject: 'structure',
  title: 'daoRulesFlat',
  description: 'daoRulesFlatDescription',
};

const DAO_STRUCTURE_GROUPS: DaoSettingOption<DAOStructureType> = {
  value: 'groups',
  icon: 'illustrationGroupsAndCommitttees',
  subject: 'structure',
  title: 'daoRulesGroups',
  description: 'daoRulesGroupsDescription',
};

export const DAO_PROPOSALS_OPTIONS: Record<
  DAOProposalsType,
  DaoSettingOption<DAOProposalsType>
> = {
  open: DAO_PROPOSALS_OPEN,
  closed: DAO_PROPOSALS_CLOSED,
};

export const DAO_VOTING_POWER_OPTIONS: Record<
  DAOVotingPowerType,
  DaoSettingOption<DAOVotingPowerType>
> = {
  democratic: DAO_VOTING_POWER_DEMOCRATIC,
  weighted: DAO_VOTING_POWER_TOKEN,
};

export const DAO_STRUCTURE_OPTIONS: Record<
  DAOStructureType,
  DaoSettingOption<DAOStructureType>
> = {
  flat: DAO_STRUCTURE_FLAT,
  groups: DAO_STRUCTURE_GROUPS,
};

export const DAO_SUBJECT_OPTIONS = {
  voting: Object.values(DAO_VOTING_POWER_OPTIONS),
  structure: Object.values(DAO_STRUCTURE_OPTIONS),
  proposals: Object.values(DAO_PROPOSALS_OPTIONS),
};

export const DAO_RULES_INFO: DaoSubjectInfo[] = [
  {
    subject: 'proposals',
    title: 'daoRulesProposals',
    subTitle: 'daoRulesProposalsDescription',
  },
  {
    subject: 'voting',
    title: 'daoRulesVoting',
    subTitle: 'daoRulesVotingDescription',
  },
  {
    subject: 'structure',
    title: 'daoRulesStructure',
    subTitle: 'daoRulesStructureDescription',
  },
];
