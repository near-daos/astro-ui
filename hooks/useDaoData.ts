import { useEffect, useState } from 'react';
import { DAO } from 'types/dao';
import { SputnikService } from 'services/SputnikService';

export function useDaoData(daoId: string): DAO | null {
  const [data, setData] = useState<DAO | null>(null);

  useEffect(() => {
    if (daoId) {
      SputnikService.getDaoById(daoId).then(res => setData(res));
    }
  }, [daoId]);

  return data ?? null;
}
