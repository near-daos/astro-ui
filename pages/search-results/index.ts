import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';

import SearchResults from './SearchResults';

export default SearchResults;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};
