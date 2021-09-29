import { useEffect, useState } from 'react';

import { DAO } from 'types/dao';
import { useAuthContext } from 'context/AuthContext';
import { SputnikService } from 'services/SputnikService';

type useDaoListPerCurrentUserReturn = {
  daos: DAO[];
};

export function useDaoListPerCurrentUser(): useDaoListPerCurrentUserReturn {
  const { accountId } = useAuthContext();

  const [daos, setDaos] = useState<DAO[]>([]);

  useEffect(() => {
    if (accountId) {
      SputnikService.getAccountDaos(accountId).then(setDaos);
    } else {
      setDaos([]);
    }
  }, [accountId]);

  return {
    daos
  };
}
