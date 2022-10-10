import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getClient } from 'utils/launchdarkly-server-client';

export async function getDefaultAppVersion(): Promise<{
  defaultApplicationUiVersion: number;
}> {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const client = await getClient();

  const defaultApplicationUiVersion = await client.variation(
    'default-application-ui-version',
    {
      key: account ?? '',
    },
    false
  );

  return {
    defaultApplicationUiVersion,
  };
}
