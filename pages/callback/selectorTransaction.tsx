import { useEffect } from 'react';
import isArray from 'lodash/isArray';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { TRANSACTIONS_KEY } from 'constants/localStorage';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

import { useWalletContext } from 'context/WalletContext';
import { useSelector } from 'context/WalletContext/hooks/walletSelector/useSelector';

const SelectorTransaction: NextPage = () => {
  const { query } = useRouter();

  const { selector } = useSelector({
    setWallet: () => 0,
    setConnectingToWallet: () => 0,
  });
  const { accountId } = useWalletContext();

  useEffect(() => {
    async function handleMount() {
      if (accountId) {
        const lsData = localStorage.getItem(TRANSACTIONS_KEY);

        if (lsData) {
          try {
            const parsedData = JSON.parse(lsData as string);
            const transactions = isArray(parsedData)
              ? parsedData
              : [parsedData];

            localStorage.removeItem(TRANSACTIONS_KEY);

            const wallet = await selector?.wallet();

            wallet?.signAndSendTransactions({
              transactions,
            });
          } catch (e) {
            localStorage.removeItem(TRANSACTIONS_KEY);
            console.error(e);
          }
        } else {
          const { errorCode, transactionHashes } = query;

          if (window.opener?.onTransaction) {
            window.opener?.onTransaction({
              accountId,
              errorCode: errorCode as SputnikWalletErrorCodes,
              transactionHashes: transactionHashes as string,
            });
          }

          window.close();
        }
      }
    }

    handleMount();
  }, [query, selector, accountId]);

  return null;
};

export default SelectorTransaction;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
    },
  };
};
