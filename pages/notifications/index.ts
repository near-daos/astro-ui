import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CookieService } from 'services/CookieService';
import { NotificationsService } from 'services/NotificationsService';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const accountId = CookieService.get<string>(ACCOUNT_COOKIE);

  let config = {};

  if (accountId) {
    config = await NotificationsService.getUserContactConfig(accountId);
  }

  return {
    props: {
      config,
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
    },
  };
};

export { default } from './NotificationsPage';
