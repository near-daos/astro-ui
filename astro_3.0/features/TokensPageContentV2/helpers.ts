import { TFunction } from 'next-i18next';

export function getSortOptions(t: TFunction): {
  label: string;
  value: string;
}[] {
  return [
    {
      label: t('allDAOsFilter.newest'),
      value: 'createdAt,DESC',
    },
    {
      label: t('allDAOsFilter.oldest'),
      value: 'createdAt,ASC',
    },
  ];
}
