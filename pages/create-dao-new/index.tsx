import CreateDaoPage from 'pages/create-dao-new/CreateDaoPage';
import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';

export default CreateDaoPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};
