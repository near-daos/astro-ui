import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getClient } from 'utils/launchdarkly-server-client';

export async function getFeatureFlags(): Promise<{
  useOpenSearchDataApi: boolean;
}> {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const client = await getClient();

  const useOpenSearchDataApi = await client.variation(
    'use-open-search-data-api',
    {
      key: account ?? '',
    },
    false
  );

  return {
    useOpenSearchDataApi,
  };
}
