import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { PaginationResponse } from 'types/api';
import { Notification } from 'types/notification';
import { AccountNotificationIndex } from 'services/SearchService/types';
import { mapAccountNotificationIndexToNotification } from 'services/SearchService/mappers/notification';
import { buildNotificationsQuery } from 'services/SearchService/builders/notification';
import { useWalletContext } from 'context/WalletContext';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  filter: string,
  accountId: string,
  accountDaosIds: string[],
  subscribedDaosIds: string[],
  offset: number,
  limit: number
  // sort?: string
): Promise<PaginationResponse<Notification[]>> {
  const initialSort = 'creatingTimeStamp,DESC';
  const sortOptions = initialSort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/accountnotification/_search?size=${limit}&from=${offset}`,
    {
      query: buildNotificationsQuery({
        filter,
        accountId,
        accountDaosIds,
        subscribedDaosIds,
      }),
      sort: [
        {
          [sortOptions[0]]: {
            order: sortOptions[1].toLowerCase(),
          },
        },
      ],
    }
  );

  const rawData = response?.data?.hits?.hits;

  const mappedData = rawData.map(
    (item: { _source: AccountNotificationIndex }) =>
      mapAccountNotificationIndexToNotification(item._source)
  );
  const total = response?.data?.hits.total.value;

  return {
    data: mappedData as Notification[],
    total,
  };
}

export function useNotificationsInfinite(
  accountDaosIds: string[],
  subscribedDaosIds: string[]
): SWRInfiniteResponse<{
  data: Notification[];
  total: number;
}> {
  const router = useRouter();
  const { query } = router;

  const limit = LIST_LIMIT_DEFAULT;
  const filter = query.notyType ?? '';
  const sort = query.sort ?? 'createTimestamp,DESC';

  const { accountId } = useWalletContext();

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return [
        'notifications',
        filter,
        accountId,
        accountDaosIds,
        subscribedDaosIds,
        offset,
        limit,
        sort,
      ];
    },
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
}
