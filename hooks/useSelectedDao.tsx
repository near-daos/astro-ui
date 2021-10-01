import { useCookie } from 'react-use';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { DAO } from 'types/dao';
import { DAO_COOKIE } from 'constants/cookies';

import { useDaoListPerCurrentUser } from './useDaoListPerCurrentUser';

/**
 * @deprecated useDad hook should be used instead
 */
export function useSelectedDAO(): DAO | null {
  const [selectedDaoCookie] = useCookie(DAO_COOKIE);
  const router = useRouter();
  const { daos } = useDaoListPerCurrentUser();

  const [selectedDao, setSelectedDao] = useState<DAO | null>(null);

  useEffect(() => {
    const daoId = router.query.dao;

    const idForFilter = daoId || selectedDaoCookie;

    if (daos) {
      const currentDao = daos?.find(item => item.id === idForFilter) || daos[0];

      setSelectedDao(currentDao);
    }
  }, [daos, router, selectedDaoCookie, setSelectedDao]);

  return selectedDao ?? null;
}
