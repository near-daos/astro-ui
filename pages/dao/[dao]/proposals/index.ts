import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';

import {
  ProposalCategories,
  ProposalsFeedStatuses,
  ProposalStatuses,
} from 'types/proposal';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getDaoContext } from 'features/daos/helpers';

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
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      daoContext,
      initialProposalsData,
      initialProposalsStatusFilterValue: status,
    },
  };
};

export { default } from './ProposalsPage';
