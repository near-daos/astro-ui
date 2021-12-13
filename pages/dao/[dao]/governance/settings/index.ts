import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SettingsPageProps } from './SettingsPage';

export const getServerSideProps: GetServerSideProps<SettingsPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  const { dao: daoId } = query;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoContext = await SputnikHttpService.getDaoContext(
    account,
    daoId as string
  );

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      daoContext,
    },
  };
};

export { default } from './SettingsPage';
