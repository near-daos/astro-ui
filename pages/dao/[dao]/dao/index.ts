import { GetServerSideProps } from 'next';

import { getDaoContext } from 'features/daos/helpers';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';
import { getClient } from 'utils/launchdarkly-server-client';

import DaoPage from './DaoPage';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale = 'en',
}) => {
  try {
    const { dao: daoId } = query;

    CookieService.initServerSideCookies(req?.headers.cookie || null);

    const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

    const client = await getClient();
    const flags = await client.allFlagsState({
      key: account ?? '',
    });

    const daoContext = !flags.getFlagValue('use-open-search-data-api')
      ? await getDaoContext(account, daoId as string)
      : null;

    return {
      props: {
        ...(await getTranslations(locale)),
        daoContext,
        ...(await getDefaultAppVersion()),
      },
    };
  } catch (e) {
    console.error(e);

    return {
      notFound: true,
    };
  }
};

export default DaoPage;
