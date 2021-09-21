import { useDaoListPerCurrentUser } from 'hooks/useDaoListPerCurrentUser';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { DAO } from 'types/dao';

export function useSelectedDAO(): DAO | null {
  const router = useRouter();
  const { daos } = useDaoListPerCurrentUser();
  const daoId = router.query.dao;

  const currentDao = useMemo(() => {
    const dao = daos.find(daoItem => daoItem.id === daoId);

    if (dao) {
      return dao;
    }

    const defaultDao = daos[0] || null;

    if (router.pathname === '/' && defaultDao) {
      router.push({ pathname: `/dao/${defaultDao.id}`, query: router.query });
    }

    return defaultDao;
  }, [daoId, daos, router]);

  return currentDao ?? null;
}
