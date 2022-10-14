import { ListItem } from './types';

export function getSelectedItems(
  list: ListItem[] | undefined,
  query: Record<string, string>
): ListItem[] {
  if (!list) {
    return [];
  }

  const values = list.reduce<Set<ListItem>>((res, item) => {
    const selected =
      Array.from(Object.entries(query)).filter(
        p => p[0] === item.queryName && p[1] === item.value
      ).length > 0;

    if (selected && item.queryName) {
      res.add(item);
    }

    return res;
  }, new Set());

  return Array.from(values);
}
