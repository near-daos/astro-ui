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
): {
  active: Record<string, number>;
  total: Record<string, number>;
} {
  const active = {} as Record<string, number>;
  const total = {} as Record<string, number>;

  const result = {
    active,
    total,
  };

  if (!proposals) return result;

  proposals.forEach(proposal => {
    if (proposal.status === 'InProgress') {
      if (active[proposal.daoId]) {
        active[proposal.daoId] += 1;
      } else {
        active[proposal.daoId] = 1;
      }
    }

    if (total[proposal.daoId]) {
      total[proposal.daoId] += 1;
    } else {
      total[proposal.daoId] = 1;
    }
  });

  return result;
}
