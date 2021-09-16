import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';

export function useDaoProposals(): Proposal[] | null {
  const router = useRouter();
  const daoId = router.query.dao;

  const [data, setData] = useState<Proposal[] | null>(null);

  useEffect(() => {
    if (daoId) {
      SputnikService.getProposals(daoId as string).then(res => setData(res));
    }
  }, [daoId]);

  return data;
}
