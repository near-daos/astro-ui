import { useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';

export function useAllProposals(): Proposal[] | null {
  const [data, setData] = useState<Proposal[] | null>(null);

  useEffect(() => {
    SputnikService.getProposals(undefined, 0, 500).then(res => setData(res));
  }, []);

  return data;
}
