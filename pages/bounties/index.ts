import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';

import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { fetchBounties } from 'astro_3.0/features/BountiesV2';
import { getFeatureFlag } from 'utils/getFeatureFlags';
import { BountiesPageProps } from './BountiesPage';

export const getServerSideProps: GetServerSideProps<
  BountiesPageProps
> = async ({ locale = 'en' }) => {
  let bountiesData = null;

  const useBountiesListV2 = await getFeatureFlag('use-bounties-list-v2');

  if (useBountiesListV2) {
    bountiesData = await fetchBounties({
      daoId: '',
      tags: [],
      statuses: {
        InProgress: false,
        Approved: false,
        Rejected: false,
      },
    });
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      bountiesContext: null,
      bountiesData,
    },
  };
};

export { default } from './BountiesPage';
