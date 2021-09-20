import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';
import { useDAOList } from 'hooks/useDAOList';

type useDaoListPerCurrentUserReturn = {
  daos: DAO[];
};

export function useDaoListPerCurrentUser(): useDaoListPerCurrentUserReturn {
  const { daos } = useDAOList();
  const accountId = SputnikService.getAccountId();

  const data = daos.filter(
    dao =>
      dao.policy.roles.filter(role => role.accountIds?.includes(accountId))
        .length > 0
  );

  return {
    daos: data
  };
}
