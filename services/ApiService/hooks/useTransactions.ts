import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { PaginationResponse } from 'types/api';
import { Receipt } from 'types/transaction';

type TransactionV2 = {
  daoId: string;
  receiptId: string;
  indexInReceipt: number;
  receiverId: string;
  predecessorId: string;
  tokenId: string;
  kind: string;
  deposit: string;
  transactionHash: string;
  createTimestamp: string;
};

function mapTransactionV2ToReceipt(
  item: TransactionV2,
  daoId: string
): Receipt {
  return {
    receiptId: item.receiptId,
    timestamp: Number(item.createTimestamp),
    receiverAccountId: item.receiverId,
    predecessorAccountId: item.predecessorId,
    deposit: item.deposit,
    type: item.receiverId === daoId ? 'Deposit' : 'Withdraw',
    txHash: item.transactionHash,
    date: new Date(Number(item.createTimestamp) / 1000000).toISOString(),
    token: item.tokenId ?? 'NEAR',
  };
}

export async function fetcher(
  url: string,
  daoId: string,
  nextToken: string,
  tokenId: string,
  limit: number
  // sort?: string
): Promise<PaginationResponse<Receipt[]>> {
  // const initialSort = sort ?? 'createdAt,DESC';
  // const sortOptions = initialSort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.API_URL
    : appConfig.API_URL;

  const apiUrl =
    tokenId === 'NEAR'
      ? `${baseUrl}/api/v2/transactions/receipts/account-receipts/${daoId}?limit=${limit}${
          nextToken ? `&nextToken=${nextToken}` : ''
        }`
      : `${baseUrl}/api/v2/transactions/receipts/account-receipts/${daoId}/tokens/${tokenId}?limit=${limit}${
          nextToken ? `&nextToken=${nextToken}` : ''
        }`;

  const response = await axios.get(apiUrl);

  const mappedData = response.data.data.map((item: TransactionV2) =>
    mapTransactionV2ToReceipt(item, daoId)
  ) as Receipt[];

  return {
    data: mappedData,
    total: 100,
    nextToken: response.data.meta.nextToken,
  };
}

export function useTransactionsInfinite(tokenId: string): SWRInfiniteResponse<{
  data: Receipt[];
  total: number;
  nextToken?: string | null;
}> {
  const router = useRouter();
  const { query } = router;

  const limit = LIST_LIMIT_DEFAULT;
  const daoId = query.dao ?? '';
  const sort = query.sort ?? 'createdAt,DESC';

  return useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.data) {
        return null;
      }

      // first page, we don't have `previousPageData`
      if (index === 0) {
        return ['transactions', daoId, null, tokenId, limit, sort];
      }

      // add the cursor to the API endpoint
      return [
        'transactions',
        daoId,
        previousPageData.nextToken,
        tokenId,
        limit,
        sort,
      ];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      // dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );
}
