import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import nextI18NextConfig from 'next-i18next.config';

import 'assets/icons';

import { CookieService } from 'services/CookieService';

import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { useRouter } from 'next/router';

type Props = {
  account: string | undefined;
};

export default function RootPage({ account }: Props): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.replace(account ? MY_FEED_URL : ALL_FEED_URL);
  }, [account, router]);

  return <div />;
}

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      account,
    },
  };
};
/*
export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {}
  };
};
*/
