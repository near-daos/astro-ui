import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { SputnikHttpService } from 'services/sputnik';

import { getTranslations } from 'utils/getTranslations';

import CfcLibraryPage from './CfcLibraryPage';

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
    },
  };
};

export default CfcLibraryPage;
