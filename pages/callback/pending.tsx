import { Loader } from 'components/loader';
import { GetServerSideProps, NextPage } from 'next';

import { getTranslations } from 'utils/getTranslations';

const Pending: NextPage = () => {
  return <Loader title="Connecting to the wallet" />;
};

export default Pending;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};
