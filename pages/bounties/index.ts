import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';

import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { BountiesPageProps } from './BountiesPage';

export const getServerSideProps: GetServerSideProps<
  BountiesPageProps
> = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      bountiesContext: null,
    },
  };
};

export { default } from './BountiesPage';
