import { useEffect, useState } from 'react';
import { SputnikService } from 'services/SputnikService';
import { Proposal } from 'types/proposal';

export function useSelectedProposal(
  daoId?: string,
  proposalId?: number
): Proposal | null {
  const [data, setData] = useState<Proposal | null>(null);

  useEffect(() => {
    if (daoId && proposalId !== undefined) {
      SputnikService.getProposal(daoId, proposalId).then(res => setData(res));
    }
  }, [daoId, proposalId]);

  return data;
}
