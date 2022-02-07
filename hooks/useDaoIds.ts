import { useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';

export const useDaoIds = (accountId: string): string[] => {
  const [daoIds, setDaoIds] = useState<string[]>([]);

  useEffect(() => {
    SputnikHttpService.getAccountDaos(accountId).then(daos => {
      setDaoIds(daos.map(dao => dao.id));
    });
  }, [accountId]);

  return daoIds;
};
