import { TFunction } from 'next-i18next';

export function getSortOptions(
  t: TFunction
): { label: string; value: string }[] {
  return [
    {
      label: t('ascending'),
      value: 'ASC',
    },
    {
      label: t('descending'),
      value: 'DESC',
    },
  ];
}
