import { DAO } from 'types/dao';

export function isUserPermittedToCreateProposal(
  accountId: string | null | undefined,
  dao: DAO
): boolean {
  if (!accountId) {
    return false;
  }

  const daoRoles = dao.policy.roles;

  let matched = false;

  daoRoles.forEach(role => {
    if (!role.accountIds && role.kind === 'Everyone') {
      if (
        role.permissions.includes('*:*') ||
        role.permissions.includes('*:AddProposal')
      ) {
        matched = true;
      }
    } else if (
      role.accountIds?.includes(accountId) &&
      (role.permissions.includes('*:*') ||
        role.permissions.includes('*:AddProposal'))
    ) {
      matched = true;
    }
  });

  return matched;
}
