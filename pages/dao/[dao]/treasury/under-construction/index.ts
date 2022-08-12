import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';

import UnderConstruction from './UnderConstruction';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};

export default UnderConstruction;
