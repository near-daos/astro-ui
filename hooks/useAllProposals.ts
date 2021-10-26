import { useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { Proposal } from 'types/proposal';

export function useAllProposals(): Proposal[] | null {
  const [data, setData] = useState<Proposal[] | null>(null);

  useEffect(() => {
    SputnikHttpService.getProposals(undefined, 0, 500).then(res =>
      setData(res)
    );
  }, []);

  return data;
}

export function getActiveProposalsCountByDao(
  proposals: Proposal[] | null
): Record<string, number> {
  const result = {} as Record<string, number>;

  if (!proposals) return result;

  proposals.forEach(proposal => {
    if (proposal.status === 'InProgress') {
      if (result[proposal.daoId]) {
        result[proposal.daoId] += 1;
      } else {
        result[proposal.daoId] = 1;
      }
    }
  });

  return result;
}
