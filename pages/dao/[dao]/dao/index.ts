import { GetServerSideProps } from 'next';
import { SputnikHttpService } from 'services/sputnik';

import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
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
      daoContext,
    },
  };
};

export default DaoPage;
