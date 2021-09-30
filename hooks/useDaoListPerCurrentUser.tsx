import { useEffect, useState } from 'react';

import { DAO } from 'types/dao';
import { SputnikService } from 'services/SputnikService';

type useDaoListPerCurrentUserReturn = {
  daos: DAO[] | null;
};

export function useDaoListPerCurrentUser(): useDaoListPerCurrentUserReturn {
  const [daos, setDaos] = useState<DAO[] | null>(null);
  const accountId = SputnikService.getAccountId();

  useEffect(() => {
    if (accountId) {
      SputnikService.getAccountDaos(accountId).then(data => {
        setDaos(data);
      });
    }
  }, [accountId]);

  return {
    daos
  };
}
