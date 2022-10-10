import { GetServerSideProps } from 'next';
import { getDaoContext } from 'features/daos/helpers';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CookieService } from 'services/CookieService';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

import CreateGovernanceToken, {
  GovernanceTokenProps,
} from './CreateGovernanceToken';

export default CreateGovernanceToken;

export const getServerSideProps: GetServerSideProps<
  GovernanceTokenProps
> = async ({ req, query, locale = 'en' }) => {
  const daoId = query.dao as string;

  CookieService.initServerSideCookies(req?.headers.cookie || null);

  const account = CookieService.get<string | undefined>(ACCOUNT_COOKIE);

  const daoContext = await getDaoContext(account, daoId);

  if (!daoContext) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await getTranslations(locale)),
      daoContext,
      ...(await getDefaultAppVersion()),
    },
  };
};
