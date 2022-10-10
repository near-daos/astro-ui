import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { DaoVersionUpdatePageProps } from './DaoVersionUpdatePage';

export const getServerSideProps: GetServerSideProps<
  DaoVersionUpdatePageProps
> = async ({ req, query, locale = 'en' }) => {
  const { dao: daoId } = query;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoContext = await getDaoContext(account, daoId as string);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      daoContext,
      ...(await getDefaultAppVersion()),
    },
  };
};

export { default } from './DaoVersionUpdatePage';
