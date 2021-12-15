import { GetServerSideProps, NextPage } from 'next';
import { Loader } from 'components/loader';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

const Pending: NextPage = () => {
  return <Loader title="Connecting to the wallet" />;
};

export default Pending;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig)),
    },
  };
};
