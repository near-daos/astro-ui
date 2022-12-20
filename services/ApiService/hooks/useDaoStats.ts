import { useFlags } from 'launchdarkly-react-client-sdk';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

import { appConfig } from 'config';

import {
  DaoStatsIndex,
  OpenSearchResponse,
} from 'services/SearchService/types';
import { mapDaoStatsIndexToChartData } from 'services/SearchService/mappers/daoStats';
import { buildDaoStatsQuery } from 'services/SearchService/builders/daoStats';
import { DaoStatsState } from 'types/daoStats';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string
): Promise<{ data: DaoStatsState[] | undefined }> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/daostats?size=1000&from=0`,
    {
      query: buildDaoStatsQuery(daoId),
    }
  );

  const rawData = response?.data?.hits?.hits;

  const data = rawData
    ? rawData.map(item => {
        return mapDaoStatsIndexToChartData(item._source as DaoStatsIndex);
      })
    : undefined;

  return { data };
}

export function useDaoStats(): { data: DaoStatsState[] | undefined } {
  const router = useRouter();
  const { query } = router;
  const daoId = query.dao ?? '';

  const { useOpenSearchDataApiDaoStats } = useFlags();

  const { data } = useSWR(
    useOpenSearchDataApiDaoStats ? ['daoStats', daoId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.data,
  };
}
