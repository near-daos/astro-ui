import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import useSWR from 'swr';
import axios from 'axios';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { PaginationResponse } from 'types/api';
import { NftToken } from 'types/token';
import { buildNftsQuery } from 'services/SearchService/builders/nfts';
import { useFlags } from 'launchdarkly-react-client-sdk';

export async function fetcher(
  url: string,
  daoId: string,
  offset: number,
  limit: number
): Promise<PaginationResponse<NftToken[]>> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/nft/_search?size=${limit}&from=${offset}`,
    {
      query: buildNftsQuery(daoId),
    }
  );

  const mappedData = mapOpenSearchResponseToSearchResult(
    'nfts',
    SearchResponseIndex.NFT,
    response.data
  );

  return {
    data: mappedData.data as NftToken[],
    total: mappedData.total,
  };
}

export function useDaoNfts(): { data: NftToken[] | undefined } {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';

  const { data } = useSWR(
    useOpenSearchDataApi ? ['nfts', daoId, 0, 300] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return { data: data?.data };
}

export function useDaoNftsInfinite(): SWRInfiniteResponse<{
  data: NftToken[];
  total: number;
}> {
  const router = useRouter();
  const { query } = router;

  const limit = LIST_LIMIT_DEFAULT;
  const daoId = query.dao ?? '';

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return ['nfts', daoId, offset, limit];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );
}
