import { TFunction } from 'next-i18next';

export function getSortOptions(t: TFunction): {
  label: string;
  value: string;
}[] {
  return [
    {
      label: t('allDAOsFilter.mostActive'),
      value: 'totalProposalCount,DESC',
    },
    {
      label: t('allDAOsFilter.newest'),
      value: 'createTimestamp,DESC',
    },
    {
      label: t('allDAOsFilter.oldest'),
      value: 'createTimestamp,ASC',
    },
    {
      label: t('allDAOsFilter.biggestFunds'),
      value: 'totalDaoFunds,DESC',
    },
    {
      label: t('allDAOsFilter.numberOfMembers'),
      value: 'numberOfMembers,DESC',
    },
  ];
}
