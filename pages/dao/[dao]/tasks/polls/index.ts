import Polls, { PollsPageProps } from 'pages/dao/[dao]/tasks/polls/PollsPage';
// eslint-disable-next-line camelcase
import { unstable_serialize } from 'swr';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalCategories, ProposalsFeedStatuses } from 'types/proposal';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';
import { getClient } from 'utils/launchdarkly-server-client';
import { fetcher as getPolls } from 'services/ApiService/hooks/useProposals';

export default Polls;

export const getServerSideProps: GetServerSideProps<PollsPageProps> = async ({
  query,
  req,
  locale = 'en',
}) => {
  const daoId = query.dao as string;
  const status =
    (query.status as ProposalsFeedStatuses) || ProposalsFeedStatuses.All;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const client = await getClient();
  const flags = await client.allFlagsState({
    key: account ?? '',
  });
  const useOpenSearchDataApi = flags.getFlagValue(
    'default-application-ui-version'
  );

  const [daoContext, initialPollsData] = await Promise.all([
    getDaoContext(account, daoId),
    useOpenSearchDataApi
      ? getPolls(
          'proposals',
          daoId,
          status,
          ProposalCategories.Polls,
          0,
          LIST_LIMIT_DEFAULT,
          account
        )
      : SputnikHttpService.getProposalsList({
          category: ProposalCategories.Polls,
          daoId,
          status,
          offset: 0,
          limit: LIST_LIMIT_DEFAULT,
          accountId: account,
        }),
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
      initialPollsData,
      initialProposalsStatusFilterValue: status,
      ...(await getDefaultAppVersion()),
      fallback: {
        [unstable_serialize([
          'proposals',
          daoId,
          status,
          ProposalCategories.Polls,
          0,
          LIST_LIMIT_DEFAULT,
          account,
        ])]: initialPollsData,
      },
    },
  };
};
