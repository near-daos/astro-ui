import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async () => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  // Todo - ask Oleg if we can include active and total count to this endpoint too
  const accountDaos = account
    ? await SputnikHttpService.getAccountDaos(account)
    : [];
  const accountDaosIds = accountDaos.map(item => item.id);

  if (!accountDaosIds.length) {
    return {
      props: {
        accountDaos: [],
      },
    };
  }

  const { data } = await SputnikHttpService.getDaosFeed({
    filter: `id||$in||${accountDaosIds.join(',')}`,
  });

  return {
    props: {
      accountDaos: data,
    },
  };
};

export default MyDaosPage;
