import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

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

export { default } from './BountiesListPage';
