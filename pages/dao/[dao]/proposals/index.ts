import { GetServerSideProps } from 'next';

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  const { status = ProposalStatuses.All, category, dao: daoId } = query;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, initialProposalsData] = await Promise.all([
    getDaoContext(account, daoId as string),
    SputnikHttpService.getProposalsList({
      offset: 0,
      limit: LIST_LIMIT_DEFAULT,
      daoId: daoId as string,
      category: category as ProposalCategories,
      status: status as ProposalsFeedStatuses,
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
      initialProposalsData,
      initialProposalsStatusFilterValue: status,
    },
  };
};

export { default } from './ProposalsPage';
