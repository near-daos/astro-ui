import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikHttpService } from 'services/sputnik';
import { ALL_FEED_URL } from 'constants/routing';
import { NotificationsService } from 'services/NotificationsService';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';
import { getClient } from 'utils/launchdarkly-server-client';
import { fetcher as getAccountDaos } from 'services/ApiService/hooks/useAccountDaos';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const accountId = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  if (!accountId) {
    return {
      redirect: {
        permanent: true,
        destination: ALL_FEED_URL,
      },
    };
  }

  const client = await getClient();
  const flags = await client.allFlagsState({
    key: accountId ?? '',
  });
  const useOpenSearchDataApi = flags.getFlagValue('use-open-search-data-api');

  const [accountDaosResponse, subscribedDaosResponse] =
    await Promise.allSettled([
      useOpenSearchDataApi
        ? getAccountDaos('accountDaos', accountId)
        : SputnikHttpService.getAccountDaos(accountId),
      SputnikHttpService.getAccountDaoSubscriptions(accountId),
    ]);

  const accountDaos =
    accountDaosResponse.status === 'fulfilled' ? accountDaosResponse.value : [];
  const subscriptions =
    subscribedDaosResponse.status === 'fulfilled'
      ? subscribedDaosResponse.value
      : [];

  const accountDaosIds = accountDaos?.map(item => item.id) ?? [];

  const [daosSettings, platformSettings] = await Promise.all([
    NotificationsService.getNotificationsSettings(accountId, accountDaosIds),
    NotificationsService.getNotificationsSettings(accountId),
  ]);

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      myDaos:
        accountDaos?.map(item => {
          return {
            dao: item,
            settings:
              daosSettings.find(daoSetting => daoSetting.daoId === item.id) ??
              null,
          };
        }) ?? [],
      subscribedDaos: subscriptions.map(item => {
        return {
          dao: item.dao,
          settings:
            daosSettings.find(daoSetting => daoSetting.daoId === item.dao.id) ??
            null,
        };
      }),
      platformSettings,
    },
  };
};

export { default } from './NotificationSettings';
