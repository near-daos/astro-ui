import Polls, { PollsPageProps } from 'pages/dao/[dao]/tasks/polls/PollsPage';
import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { ProposalCategories, ProposalStatuses } from 'types/proposal';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

export default Polls;

export const getServerSideProps: GetServerSideProps<PollsPageProps> = async ({
  query,
  req,
  locale = 'en',
}) => {
  const daoId = query.dao as string;
  const status = query.status as ProposalStatuses;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, initialPollsData] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId),
    SputnikHttpService.getProposalsList({
      category: ProposalCategories.Polls,
      daoId,
      status,
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoFilter: 'All DAOs',
    }),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      daoContext,
      initialPollsData,
    },
  };
};
