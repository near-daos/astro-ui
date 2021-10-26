import { useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { Proposal } from 'types/proposal';

export function useProposal(
  daoId?: string,
  proposalId?: number
): Proposal | null {
  const [data, setData] = useState<Proposal | null>(null);

  useEffect(() => {
    if (daoId && proposalId !== undefined) {
      SputnikHttpService.getProposal(daoId, proposalId).then(res =>
        setData(res)
      );
    }
  }, [daoId, proposalId]);

  return data;
}
