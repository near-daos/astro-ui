import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { SputnikHttpService } from 'services/sputnik';
import { mocks } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoId = query.dao as string;
  const draftId = query.draft as string;

  const [dao, daoContext] = await Promise.all([
    SputnikHttpService.getDaoById(daoId),
    getDaoContext(account, daoId as string),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  const draft = mocks.data.find(mock => mock.id === draftId);

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
