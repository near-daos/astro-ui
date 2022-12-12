import useSWR from 'swr';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { appConfig } from 'config';
import axios from 'axios';
import { AccountIndex, OpenSearchResponse } from 'services/SearchService/types';
import { useWalletContext } from 'context/WalletContext';
import { UserContacts } from 'services/NotificationsService/types';
import { mapAccountIndexToUserContacts } from 'services/SearchService/mappers/account';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  accountId?: string
): Promise<UserContacts> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/account/_search`,
    {
      query: {
        simple_query_string: {
          query: accountId,
          fields: ['accountId'],
        },
      },
    }
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  return (
    mapAccountIndexToUserContacts(rawData as AccountIndex) ?? {
      accountId: '',
      email: '',
      isEmailVerified: false,
      phoneNumber: '',
      isPhoneVerified: false,
    }
  );
}

export function useUserContacts(): {
  data: UserContacts | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { accountId } = useWalletContext();
  const { useOpenSearchDataApiUserContacts } = useFlags();

  const { data, error } = useSWR(
    useOpenSearchDataApiUserContacts ? ['userContacts', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading: !data,
    isError: !!error,
  };
}
