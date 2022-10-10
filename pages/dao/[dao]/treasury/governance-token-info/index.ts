import GovernanceTokenInfoPage, {
  GovernanceTokenInfoPageProps,
} from 'pages/dao/[dao]/treasury/governance-token-info/GovernanceTokenInfoPage';
import { GetServerSideProps } from 'next';
import { CookieService } from 'services/CookieService';
import { ACCOUNT_COOKIE } from 'constants/cookies';
import { getDaoContext } from 'features/daos/helpers';
import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

export const getServerSideProps: GetServerSideProps<
  GovernanceTokenInfoPageProps
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

export default GovernanceTokenInfoPage;
