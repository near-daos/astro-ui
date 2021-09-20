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

    if (daoId != null) {
      return daos.find(dao => dao.id === daoId);
    }

    const defaultDao = daos[0];

    router.push({ pathname: `/dao/${defaultDao.id}`, query: router.query });

    return defaultDao;
  }, [daoId, daos, router]);

  return currentDao ?? null;
}
