import Tokens, {
  TokensPageProps,
} from 'pages/dao/[dao]/treasury/tokens/TokensPage';
import { SputnikHttpService } from 'services/sputnik';
import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';

export const getServerSideProps: GetServerSideProps<TokensPageProps> = async ({
  req,
  query,
}) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const [daoContext, receipts] = await Promise.all([
    SputnikHttpService.getDaoContext(account, daoId),
    SputnikHttpService.getAccountReceipts(daoId),
  ]);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      receipts,
      daoContext,
    },
  };
};

export default Tokens;
