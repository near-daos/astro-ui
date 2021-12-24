import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikHttpService } from 'services/sputnik';
import { ALL_FEED_URL } from 'constants/routing';
import { NotificationsService } from 'services/NotificationsService';

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

  const [accountDaos, subscriptions] = await Promise.all([
    SputnikHttpService.getAccountDaos(accountId),
    SputnikHttpService.getAccountDaoSubscriptions(accountId),
  ]);

  const accountDaosIds = accountDaos.map(item => item.id);

  const [daosSettings, platformSettings] = await Promise.all([
    NotificationsService.getNotificationsSettings(accountDaosIds),
    NotificationsService.getNotificationsSettings(),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      myDaos: accountDaos.map(item => {
        return {
          dao: item,
          settings:
            daosSettings.find(daoSetting => daoSetting.daoId === item.id) ??
            null,
        };
      }),
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
