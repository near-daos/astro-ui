import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { getTranslations } from 'utils/getTranslations';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
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

export default MyDaosPage;
