/* eslint-disable @typescript-eslint/no-shadow */

import { renderHook } from '@testing-library/react-hooks/dom';

import { Member } from 'types/dao';

import { useSortMembers } from 'astro_2.0/features/Groups/hooks/useSortMembers';

describe('useSortMembers', () => {
  const m1 = {
    id: '1',
    name: 'm1',
    groups: ['gr1', 'gr2'],
    tokens: {
      value: 5,
    },
    votes: 4,
  } as Member;

  const m2 = {
    id: '2',
    name: 'm2',
    groups: ['gr2', 'gr3'],
    tokens: {
      value: 10,
    },
    votes: 2,
  } as Member;

  const m3 = {
    id: '3',
    name: 'm3',
    groups: ['gr2'],
    tokens: {
      value: 12,
    },
    votes: 2,
  } as Member;

  const members = [m1, m2, m3];

  function renderUseSortMembers(
    members: Member[],
    group: string,
    activeSort: string
  ) {
    return renderHook(() =>
      useSortMembers({
        members,
        group,
        activeSort,
      })
    );
  }

  it('Should filter out members that are not in the group', () => {
    const { result } = renderUseSortMembers(members, 'gr1', 'Most active');

    expect(result.current).toEqual([m1]);
  });

  it('Should let all users if group is "all" and sort them by token', () => {
    const { result } = renderUseSortMembers(members, 'all', '# of tokens');

    expect(result.current).toEqual([m3, m2, m1]);
  });

  it('Should properly filter members by group and sort them by votes', () => {
    const { result } = renderUseSortMembers(members, 'gr2', 'Most active');

    expect(result.current).toEqual([m1, m2, m3]);
  });

  it('Should not fail if active sort is not defined', () => {
    const { result } = renderUseSortMembers(members, 'gr2', '');

    expect(result.current).toEqual([m1, m2, m3]);
  });
});
