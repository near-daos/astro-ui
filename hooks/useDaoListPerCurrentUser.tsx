import { SputnikService } from 'services/SputnikService';
import { DAO } from 'types/dao';
import { useEffect, useState } from 'react';

type useDaoListPerCurrentUserReturn = {
  daos: DAO[];
};

export function useDaoListPerCurrentUser(
  enabled = true
): useDaoListPerCurrentUserReturn {
  const accountId = enabled ? SputnikService.getAccountId() : '';
  const [daos, setDaos] = useState<DAO[]>([]);

  useEffect(() => {
    if (accountId) {
      SputnikService.getDaoList({
        filter: `createdBy||$eq||${accountId}`
      }).then(setDaos);
    } else {
      setDaos([]);
    }
  }, [accountId]);

  return {
    daos
  };
}
