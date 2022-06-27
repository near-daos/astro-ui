import { DAO } from 'types/dao';

export function isCouncilUser(dao: DAO, accountId: string): boolean {
  return (
    dao.groups
      .find(group => group.slug === 'council')
      ?.members.includes(accountId) ?? false
  );
}
