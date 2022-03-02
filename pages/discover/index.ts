import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';
import DiscoverPage from 'pages/discover/DiscoverPage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
    },
  };
};

export default DiscoverPage;
