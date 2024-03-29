import { GetServerSideProps, NextPage } from 'next';

import { getTranslations } from 'utils/getTranslations';

import { useSelectorWalletTransactionResult } from 'astro_3.0/features/TransactionResult/hooks';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

const Transaction: NextPage = () => {
  useSelectorWalletTransactionResult();

  return null;
};

export default Transaction;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
    },
  };
};
