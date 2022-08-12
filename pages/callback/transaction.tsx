import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { getTranslations } from 'utils/getTranslations';

const Transaction: NextPage = () => {
  useEffect(() => {
    const callback = window.opener?.sputnikRequestSignTransactionCompleted;

    if (typeof callback === 'function') {
      const { searchParams } = new URL(window.location.toString());
      const transactionHashes =
        searchParams.get('transactionHashes') || undefined;
      const errorCode = (searchParams.get('errorCode') ||
        undefined) as SputnikWalletErrorCodes;

      callback?.({ transactionHashes, errorCode });

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      window.close();
    }
  }, []);

  return null;
};

export default Transaction;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};
