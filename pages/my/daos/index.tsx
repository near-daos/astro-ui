import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

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
      ...(await serverSideTranslations(locale, ['common'])),
      accountDaos: data,
    },
  };
};

export default MyDaosPage;
