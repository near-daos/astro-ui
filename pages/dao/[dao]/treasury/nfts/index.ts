import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { NFTsPageProps } from './NFTs';

export { default } from 'pages/dao/[dao]/treasury/nfts/NFTs';

export const getServerSideProps: GetServerSideProps<NFTsPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId),
  ]);

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
