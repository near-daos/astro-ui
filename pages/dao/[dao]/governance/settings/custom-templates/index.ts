import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { DaoContext } from 'types/context';
import { SputnikHttpService } from 'services/sputnik';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

export const getServerSideProps: GetServerSideProps<{
  daoContext: DaoContext;
}> = async ({ req, query, locale = 'en' }) => {
  const { dao: daoId } = query;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoContext = await getDaoContext(account, daoId as string);

  const accountDaos = account
    ? await SputnikHttpService.getAccountDaos(account)
    : [];

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      daoContext,
      accountDaos,
      ...(await getDefaultAppVersion()),
    },
  };
};

export { default } from './CustomTemplatesPage';
