import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import { ALL_FEED_URL } from 'constants/routing';

import { CookieService } from 'services/CookieService';
import { NotificationsService } from 'services/NotificationsService';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';
import { getClient } from 'utils/launchdarkly-server-client';
import { fetcher as getUserContacts } from 'services/ApiService/hooks/useUserContacts';

import MyAccountPage, { MyAccountPageProps } from './MyAccountPage';

export const getServerSideProps: GetServerSideProps<
  MyAccountPageProps
> = async ({ locale = 'en' }) => {
  const accountId = CookieService.get<string>(ACCOUNT_COOKIE);

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
  const useOpenSearchDataApiUserContacts = flags.getFlagValue(
    'useOpenSearchDataApiUserContacts'
  );

  const contactsConfig = useOpenSearchDataApiUserContacts
    ? await getUserContacts('userContacts', accountId)
    : await NotificationsService.getUserContactConfig(accountId);

  const notyConfig = await NotificationsService.getNotificationsSettings(
    accountId
  );

  return {
    props: {
      notyConfig: notyConfig[0] || {},
      contactsConfig,
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
      ...(await getDefaultAppVersion()),
    },
  };
};

export default MyAccountPage;
