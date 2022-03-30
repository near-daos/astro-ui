import { useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { useMountedState } from 'react-use';

export const useDaoIds = (accountId: string | undefined): string[] => {
  const isMounted = useMountedState();
  const [daoIds, setDaoIds] = useState<string[]>([]);

  useEffect(() => {
    if (accountId) {
      SputnikHttpService.getAccountDaos(accountId).then(daos => {
        if (isMounted()) {
          setDaoIds(daos.map(dao => dao.id));
        }
      });
    }
  }, [accountId, isMounted]);

  return daoIds;
};
