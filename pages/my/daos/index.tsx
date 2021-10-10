import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async () => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);
  const accountDaos = account
    ? await SputnikService.getAccountDaos(account)
    : [];

  return {
    props: {
      accountDaos
    }
  };
};

export default MyDaosPage;
