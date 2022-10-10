import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';

import DiscoverPage from 'pages/discover/DiscoverPage';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
    },
  };
};

export default DiscoverPage;
