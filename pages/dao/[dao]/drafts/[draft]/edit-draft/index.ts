import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { DraftsService } from 'services/DraftsService';
import { isCouncilUser } from 'astro_2.0/features/DraftComments/helpers';

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

  const daoContext = await getDaoContext(accountId, daoId as string);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  const dao = daoContext?.dao;

  const draft = await draftService.getDraft(draftId, dao, accountId);

  const isCouncil = isCouncilUser(dao, accountId || '');

  if (!draft || !daoContext || (draft.proposer !== accountId && !isCouncil)) {
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
      daoContext,
      draft,
    },
  };
};

export { default } from './EditDraftPage';
