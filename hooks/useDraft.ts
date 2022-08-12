import { useState, useEffect } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { PaginationResponse } from 'types/api';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { useDraftService } from './useDraftService';

export function useDraft(
  daoId: string
): PaginationResponse<DraftProposalFeedItem[]> | null {
  const { accountId } = useWalletContext();
  const [data, setData] = useState<PaginationResponse<
    DraftProposalFeedItem[]
  > | null>(null);
  const draftsService = useDraftService();

  useEffect(() => {
    const fetchData = async () => {
      if (draftsService) {
        const res = await draftsService.getDrafts({
          offset: 0,
          limit: 1000,
          daoId,
          accountId,
          isSaved: 'false',
        });

        if (!res) {
          setData(null);
        }

        setData(res);
      }
    };

    fetchData();
  }, [accountId, daoId, draftsService]);

  return data;
}
