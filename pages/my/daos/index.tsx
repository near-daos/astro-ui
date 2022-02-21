import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const accountDaos = account
    ? await SputnikHttpService.getAccountDaos(account)
    : [];

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      accountDaos,
    },
  };
};

export default MyDaosPage;
