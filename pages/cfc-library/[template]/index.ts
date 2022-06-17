import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { SputnikHttpService } from 'services/sputnik';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import SharedlTemplatePage from './SharedlTemplatePage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

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

export default SharedlTemplatePage;
