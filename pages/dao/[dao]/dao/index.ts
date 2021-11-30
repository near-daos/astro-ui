import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { ProposalCategories, ProposalStatuses } from 'types/proposal';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { status = ProposalStatuses.Active, category, dao: daoId } = query;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, initialProposalsData] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId as string),
    SputnikHttpService.getProposalsList({
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoId: daoId as string,
      category: category as ProposalCategories,
      status: status as ProposalStatuses,
    }),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      daoContext,
      initialProposalsData,
    },
  };
};

export default DaoPage;
