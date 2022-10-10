import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';

import 'assets/icons';

import { CookieService } from 'services/CookieService';

import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

type Props = {
  account: string | null;
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
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      account: account || null,
    },
  };
};
