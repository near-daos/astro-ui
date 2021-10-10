import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikService } from 'services/SputnikService';
import sortBy from 'lodash/sortBy';
import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>('account');

  const data = account ? await SputnikService.getAccountDaos(account) : [];

  return {
    props: {
      accountDaos: sortBy(data, 'id')
    }
  };
};

export default MyDaosPage;
