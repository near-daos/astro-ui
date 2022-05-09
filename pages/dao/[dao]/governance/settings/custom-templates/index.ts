import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { DaoContext } from 'types/context';
import { SputnikHttpService } from 'services/sputnik';

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
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      daoContext,
      accountDaos,
    },
  };
};

export { default } from './CustomTemplatesPage';
