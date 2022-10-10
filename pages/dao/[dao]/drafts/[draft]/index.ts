import { GetServerSideProps } from 'next';

import { CookieService } from 'services/CookieService';
import { DraftsService } from 'services/DraftsService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

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

  const dao = daoContext?.dao;

  const draft = await draftService.getDraft(draftId, dao, accountId);

  if (!draft || !daoContext) {
    return {
      props: {
        ...(await getTranslations(locale)),
      },
      redirect: {
        permanent: true,
        destination: `/dao/${daoId}/drafts`,
      },
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      dao,
      draft,
      daoContext,
      ...(await getDefaultAppVersion()),
    },
  };
};

export { default } from './DraftPage';
