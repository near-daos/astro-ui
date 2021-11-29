import { Option } from './types';

export const allStatusFilterOption: Option = {
  label: 'All',
  value: 'All',
};

export const activeProposalsStatusFilterOption: Option = {
  label: 'Active',
  value: 'Active',
};

export const acceptedProposalsStatusFilterOption: Option = {
  label: 'Approved',
  value: 'Approved',
};

export const inactiveProposalsStatusFilterOption: Option = {
  label: 'Failed',
  value: 'Failed',
};

export const statusFilterOptions: Option[] = [
  allStatusFilterOption,
  activeProposalsStatusFilterOption,
  acceptedProposalsStatusFilterOption,
  inactiveProposalsStatusFilterOption,
];

export const daoFilterOptions = [
  {
    label: 'In this DAO',
    value: 'In this DAO',
  },
  {
    label: 'In all DAOs',
    value: 'In all DAOs',
  },
];
