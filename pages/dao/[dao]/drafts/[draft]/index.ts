import { GetServerSideProps } from 'next';
import nextI18NextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { SputnikHttpService } from 'services/sputnik';
import { CookieService } from 'services/CookieService';
import { DraftsService } from 'services/DraftsService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { extractMembersFromDao } from 'astro_2.0/features/CreateProposal/helpers';
import { getDaoContext } from 'features/daos/helpers';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  const draftService = new DraftsService();

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const accountId = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;
  const draftId = query.draft as string;

  const [membersStats, daoContext] = await Promise.all([
    SputnikHttpService.getDaoMembersStats(daoId),
    getDaoContext(accountId, daoId as string),
  ]);

  const dao = daoContext?.dao;

  const draft = await draftService.getDraft(draftId, dao);

  const members = dao ? extractMembersFromDao(dao, membersStats) : [];

  if (!daoContext) {
    return {
      props: {
        ...(await serverSideTranslations(
          locale,
          ['common', 'notificationsPage'],
          nextI18NextConfig
        )),
      },
      redirect: {
        permanent: true,
        destination: `/dao/${daoId}/drafts`,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      dao,
      draft,
      members,
      daoContext,
    },
  };
};

export { default } from './DraftPage';
