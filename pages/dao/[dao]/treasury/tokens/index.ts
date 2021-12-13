import Tokens, {
  TokensPageProps,
} from 'pages/dao/[dao]/treasury/tokens/TokensPage';
import { SputnikHttpService } from 'services/sputnik';
import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps<TokensPageProps> = async ({
  req,
  query,
  locale = 'en',
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoContext = await SputnikHttpService.getDaoContext(account, daoId);

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

export default Tokens;
