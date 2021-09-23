import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookie } from 'react-use';
import { DAO } from 'types/dao';
import { useDaoListPerCurrentUser } from './useDaoListPerCurrentUser';

export const DAO_COOKIE = 'selectedDao';

/**
 * @deprecated useDad hook should be used instead
 */
export function useSelectedDAO(): DAO | null {
  const router = useRouter();
  const daoId = router.query.dao;
  const { daos } = useDaoListPerCurrentUser(true);
  const [selectedDaoCookie, setSelectedDaoCookie] = useCookie(DAO_COOKIE);

  useEffect(() => {
    const selectedDao = daos.find(item => item.id === daoId) || daos[0];

    if (selectedDao) {
      setSelectedDaoCookie(selectedDao.id, { expires: 30 * 24 * 60 * 60 });

      if (router.pathname === '/') {
        router.push({
          pathname: `/dao/${selectedDao.id}`,
          query: router.query
        });
      }
    }
  }, [daoId, daos, router, setSelectedDaoCookie]);

  const currentDao = useDao(selectedDaoCookie || '', {
    enabled: !!selectedDaoCookie
  });

  return currentDao ?? null;
}
