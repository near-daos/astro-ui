import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';
import { useDAOList } from 'hooks/useDAOList';

type useDaoListPerCurrentUserReturn = {
  daos: DAO[];
};

export function useDaoListPerCurrentUser(
  enabled = true
): useDaoListPerCurrentUserReturn {
  const { daos } = useDAOList();
  const accountId = enabled ? SputnikService.getAccountId() : '';

  const data = daos.filter(
    dao =>
      dao.policy.roles.filter(role => role.accountIds?.includes(accountId))
        .length > 0
  );

  return {
    daos: data
  };
}
