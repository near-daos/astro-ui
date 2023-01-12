import { GetServerSideProps } from 'next';

import { CookieService } from 'services/CookieService';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale = 'en',
}) => {
  try {
    CookieService.initServerSideCookies(req?.headers.cookie || null);

    return {
      props: {
        ...(await getTranslations(locale)),
        ...(await getDefaultAppVersion()),
      },
    };
  } catch (e) {
    console.error(e);

    return {
      notFound: true,
    };
  }
};

export default DaoPage;
