import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookie } from 'react-use';
import { DAO } from 'types/dao';
import { useDaoListPerCurrentUser } from './useDaoListPerCurrentUser';

export const DAO_COOKIE = 'selectedDao';

/**
 * @deprecated useDad hook should be used instead
 */
export function useSelectedDAO(): DAO | null {
  const [selectedDaoCookie] = useCookie(DAO_COOKIE);
  const router = useRouter();
  const { daos } = useDaoListPerCurrentUser(true);

  const [selectedDao, setSelectedDao] = useState<DAO | null>(null);

  useEffect(() => {
    const daoId = router.query.dao;

    const idForFilter = daoId || selectedDaoCookie;
    const currentDao = daos.find(item => item.id === idForFilter) || daos[0];

    setSelectedDao(currentDao);
  }, [daos, router, selectedDaoCookie, setSelectedDao]);

  useEffect(() => {
    if (selectedDao) {
      if (router.pathname === '/') {
        router.push({
          pathname: `/dao/${selectedDao.id}`,
          query: router.query
        });
      }
    }
  }, [router, selectedDao]);

  return selectedDao ?? null;
}
