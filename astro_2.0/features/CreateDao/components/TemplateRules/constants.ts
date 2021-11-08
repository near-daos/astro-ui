import {
  DAOProposalsType,
  DAOStructureType,
  DAOTemplate,
  DAOVotingPowerType,
} from 'astro_2.0/features/CreateDao/components/types';

interface Template {
  proposals: DAOProposalsType;
  structure: DAOStructureType;
  voting: DAOVotingPowerType;
}

export const CUSTOM_TEMPLATE = 'custom';

export const CLUB_TEMPLATE: Template = {
  proposals: 'closed',
  structure: 'flat',
  voting: 'democratic',
};

export const FOUNDATION_TEMPLATE: Template = {
  proposals: 'open',
  structure: 'groups',
  voting: 'democratic',
};

export const CORP_TEMPLATE: Template = {
  proposals: 'closed',
  structure: 'groups',
  voting: 'weighted',
};

export const COOP_TEMPLATE: Template = {
  proposals: 'closed',
  structure: 'groups',
  voting: 'democratic',
};

export const DAO_TEMPLATE_CLUB: DAOTemplate = {
  variant: 'club',
  title: 'Club',
  description: `A small circle of friends
A group of fans
A social club`,
  ...CLUB_TEMPLATE,
};

export const DAO_TEMPLATE_FOUNDATION: DAOTemplate = {
  variant: 'foundation',
  title: 'Foundation',
  description: `A group giving donations
An organization funding community projects
A fund for open-source projects`,
  ...FOUNDATION_TEMPLATE,
};

export const DAO_TEMPLATE_CORP: DAOTemplate = {
  variant: 'corporation',
  title: 'Corporation',
  description: `A business with shareholders
A startup or company`,
  ...CORP_TEMPLATE,
};

export const DAO_TEMPLATE_COOP: DAOTemplate = {
  variant: 'cooperative',
  title: 'Cooperative',
  description: `A business with members
A creative collective`,
  ...COOP_TEMPLATE,
};

export const DAO_TEMPLATES: DAOTemplate[] = [
  DAO_TEMPLATE_CLUB,
  DAO_TEMPLATE_FOUNDATION,
  DAO_TEMPLATE_CORP,
  DAO_TEMPLATE_COOP,
];
