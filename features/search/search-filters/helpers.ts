export type Option = {
  label: string;
  value: string;
};

export const allStatusFilterOption: Option = {
  label: 'All',
  value: 'All',
};

export const activeProposalsStatusFilterOption: Option = {
  label: 'Active proposals',
  value: 'Active proposals',
};

export const acceptedProposalsStatusFilterOption: Option = {
  label: 'Accepted proposals',
  value: 'Accepted proposals',
};

export const inactiveProposalsStatusFilterOption: Option = {
  label: 'Inactive proposals',
  value: 'Inactive proposals',
};

export const rejectedProposalsStatusFilterOption: Option = {
  label: 'Rejected / Expired Proposals',
  value: 'Rejected / Expired Proposals',
};

export const spamDismissedProposalsStatusFilterOption: Option = {
  label: 'Spam / Dismissed Proposals',
  value: 'Spam / Dismissed Proposals',
};

export const statusFilterOptions: Option[] = [
  allStatusFilterOption,
  activeProposalsStatusFilterOption,
  acceptedProposalsStatusFilterOption,
  inactiveProposalsStatusFilterOption,
  rejectedProposalsStatusFilterOption,
  spamDismissedProposalsStatusFilterOption,
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
