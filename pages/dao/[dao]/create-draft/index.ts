import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const accountId = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;

  const daoContext = await getDaoContext(accountId, daoId as string);

  if (
    !daoContext ||
    !daoContext.dao?.daoMembersList.includes(accountId || '')
  ) {
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
    },
  };
};

export { default } from './CreateDraftPage';
