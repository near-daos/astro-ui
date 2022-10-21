import { GetServerSideProps } from 'next';
import { getClient } from 'utils/launchdarkly-server-client';
// eslint-disable-next-line camelcase
import { unstable_serialize } from 'swr';

import {
  ProposalCategories,
  ProposalsFeedStatuses,
  ProposalStatuses,
} from 'types/proposal';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { getDaoContext } from 'features/daos/helpers';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { fetcher as getProposals } from 'services/ApiService/hooks/useProposals';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  const { status = ProposalStatuses.All, category, dao: daoId } = query;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const client = await getClient();
  const flags = await client.allFlagsState({
    key: account ?? '',
  });
  const useOpenSearchDataApi = flags.getFlagValue('use-open-search-data-api');

  const params = {
    offset: 0,
    limit: LIST_LIMIT_DEFAULT,
    daoId: daoId as string,
    category: category as ProposalCategories,
    status: status as ProposalsFeedStatuses,
    accountId: account,
  };

  const [daoContext, initialProposalsData] = await Promise.all([
    getDaoContext(account, daoId as string),
    useOpenSearchDataApi
      ? getProposals(
          'proposals',
          params.daoId,
          params.status,
          params.category,
          0,
          LIST_LIMIT_DEFAULT,
          params.accountId
        )
      : SputnikHttpService.getProposalsList(params),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      daoContext,
      initialProposalsData,
      initialProposalsStatusFilterValue: status,
      ...(await getDefaultAppVersion()),
      fallback: {
        [unstable_serialize([
          'proposals',
          params.daoId,
          params.status,
          params.category,
          0,
          LIST_LIMIT_DEFAULT,
          params.accountId,
        ])]: initialProposalsData,
      },
    },
  };
};

export { default } from './ProposalsPage';
