import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const accountId = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;

  const daoContext = await getDaoContext(accountId, daoId as string);

  if (!daoContext || !accountId) {
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

export { default } from './CreateDraftPage';
