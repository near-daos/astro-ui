import { TFunction } from 'next-i18next';

export function getSortOptions(
  t: TFunction
): { label: string; value: string }[] {
  return [
    {
      label: t('ascending'),
      value: 'updatedAt,DESC',
    },
    {
      label: t('descending'),
      value: 'updatedAt,ASC',
    },
  ];
}
