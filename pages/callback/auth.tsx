import { useEffect } from 'react';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { GetServerSideProps, NextPage } from 'next';

import { getTranslations } from 'utils/getTranslations';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

const Callback: NextPage = () => {
  useEffect(() => {
    const { searchParams } = new URL(window.location.toString());
    const accountId = searchParams.get('account_id') || undefined;
    const errorCode = (searchParams.get('errorCode') ||
      undefined) as SputnikWalletErrorCodes;
    const allKeys = searchParams.get('all_keys') || undefined;
    const publicKey = searchParams.get('public_key') || undefined;

    if (window.opener?.sputnikRequestSignInCompleted) {
      window.opener
        .sputnikRequestSignInCompleted({
          accountId,
          errorCode,
          allKeys,
          publicKey,
        })
        .then(() => window.close());
    }
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
  locale = 'en',
}) => {
  const accountId = query.account_id;

  res.setHeader(
    'set-cookie',
    `${ACCOUNT_COOKIE}=${accountId}; path=/; Max-Age=${Number.MAX_SAFE_INTEGER}`
  );

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
    },
  };
};

export default Callback;
