import axios from 'axios';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import useSWR from 'swr';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { useDaoCustomTokens } from 'context/DaoTokensContext';
import { formatYoktoValue } from 'utils/format';

export async function fetcher(
  url: string,
  daoId: string,
  tokenId: string
): Promise<{ timestamp: number; value: string }[]> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.API_URL
    : appConfig.API_URL;

  const apiUrl =
    tokenId === 'NEAR'
      ? `${baseUrl}/api/v1/transactions/daily-balance/${daoId}`
      : `${baseUrl}/api/v1/transactions/daily-balance/${daoId}/token/${tokenId}`;

  const response = await axios.get(apiUrl);

  return response.data;
}

export function useTransactionsDailyBalance(tokenId: string): {
  data: ChartDataElement[] | undefined;
} {
  const { tokens } = useDaoCustomTokens();
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';

  const { data } = useSWR(
    ['transactionsDailyBalance', daoId, tokenId],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const tokenData = tokens[tokenId];

  if (!tokenData) {
    return {
      data: [],
    };
  }

  return {
    data: data?.map(item => ({
      x: new Date(item.timestamp),
      y: Number(formatYoktoValue(item.value, tokenData.decimals)),
    })),
  };
}
