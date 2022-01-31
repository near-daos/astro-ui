import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { SputnikHttpService } from 'services/sputnik';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config';

import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaosList } from 'features/daos/helpers';

import MyDaosPage from './MyDaosPage';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const accountDaosIds = account
    ? await SputnikHttpService.getAccountDaosIds(account)
    : [];

  if (!accountDaosIds.length) {
    return {
      props: {
        accountDaos: [],
      },
    };
  }

  const { daos } = await getDaosList({
    filter: `id||$in||${accountDaosIds.join(',')}`,
  });

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'notificationsPage'],
        nextI18NextConfig
      )),
      accountDaos: daos,
    },
  };
};

export default MyDaosPage;
