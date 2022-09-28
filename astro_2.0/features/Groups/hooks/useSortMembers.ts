import get from 'lodash/get';
import { useMemo } from 'react';
import { Member } from 'types/dao';

type UseSortMembersParams = {
  members: Member[];
  group: string;
  activeSort: string;
};

export const useSortMembers = ({
  members,
  group,
  activeSort,
}: UseSortMembersParams): Member[] => {
  return useMemo(() => {
    return members
      .filter(
        item =>
          !group ||
          group === 'all' ||
          item.groups
            .map(grp => grp.toLowerCase())
            .includes((group as string).toLowerCase())
      )
      .sort((a, b) => {
        let sortField = '';

        if (activeSort === 'Most active') {
          sortField = 'votes';
        } else if (activeSort === '# of tokens') {
          sortField = 'tokens.value';
        }

        if (get(a, sortField) > get(b, sortField)) {
          return -1;
        }

        if (get(a, sortField) < get(b, sortField)) {
          return 1;
        }

        return 0;
      });
  }, [activeSort, group, members]);
};
