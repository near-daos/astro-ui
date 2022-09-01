import { GetServerSideProps, NextPage } from 'next';

import { getTranslations } from 'utils/getTranslations';

import {
  useSelectorWalletTransactionResult,
  useWalletTransactionResult,
} from 'astro_3.0/features/TransactionResult/hooks';

const Transaction: NextPage = () => {
  useSelectorWalletTransactionResult();
  useWalletTransactionResult();

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
