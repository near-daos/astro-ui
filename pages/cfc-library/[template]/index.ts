import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';

import { SputnikHttpService } from 'services/sputnik';
import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import SharedlTemplatePage from './SharedlTemplatePage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale = 'en',
}) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const accountDaos = account
    ? await SputnikHttpService.getAccountDaos(account)
    : [];

  return {
    props: {
      ...(await getTranslations(locale)),
      accountDaos,
      ...(await getDefaultAppVersion()),
    },
  };
};

export default SharedlTemplatePage;
