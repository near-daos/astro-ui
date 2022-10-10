import { GetServerSideProps } from 'next';

import { getDaoContext } from 'features/daos/helpers';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  try {
    const { dao: daoId } = query;

    CookieService.initServerSideCookies(req?.headers.cookie || null);

    const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

    const daoContext = await getDaoContext(account, daoId as string);

    if (!daoContext) {
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
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default DaoPage;
