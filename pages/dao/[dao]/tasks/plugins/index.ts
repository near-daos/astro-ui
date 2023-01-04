import { GetServerSideProps } from 'next';

import { CookieService } from 'services/CookieService';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import { PluginPageProps } from './PluginsPage';

export const getServerSideProps: GetServerSideProps<PluginPageProps> = async ({
  req,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  return {
    props: {
      ...(await getTranslations(locale)),
      ...(await getDefaultAppVersion()),
      plugins: [],
    },
  };
};

export { default } from './PluginsPage';
