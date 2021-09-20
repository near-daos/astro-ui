import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { DAO } from 'types/dao';

export function useSelectedDAO(): DAO | null {
  const router = useRouter();
  const { daos } = useDaoListPerCurrentUser();
  const daoId = router.query.dao;

  const currentDao = useMemo(() => {
    if (daos == null || daos.length === 0) return null;

    return daoId != null ? daos.find(dao => dao.id === daoId) : daos[0];
  }, [daoId, daos]);

  return currentDao ?? null;
}
