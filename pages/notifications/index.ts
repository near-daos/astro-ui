import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const accountId = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  let accountDaosIds: string[];
  let subscribedDaosIds: string[];

  if (accountId) {
    const [
      accountDaosResponse,
      subscribedDaosResponse,
    ] = await Promise.allSettled([
      SputnikHttpService.getAccountDaos(accountId),
      SputnikHttpService.getAccountDaoSubscriptions(accountId),
    ]);

    accountDaosIds =
      accountDaosResponse.status === 'fulfilled'
        ? accountDaosResponse.value.map(item => item.id)
        : [];
    subscribedDaosIds =
      subscribedDaosResponse.status === 'fulfilled'
        ? subscribedDaosResponse.value.map(item => item.dao.id)
        : [];
  } else {
    accountDaosIds = [];
    subscribedDaosIds = [];
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      accountDaosIds,
      subscribedDaosIds,
    },
  };
};

export { default } from './NotificationsPage';
