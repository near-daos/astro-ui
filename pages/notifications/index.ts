import { GetServerSideProps } from 'next';

import { ACCOUNT_COOKIE } from 'constants/cookies';

import { CookieService } from 'services/CookieService';
import { NotificationsService } from 'services/NotificationsService';

import { getTranslations } from 'utils/getTranslations';
import { getDefaultAppVersion } from 'utils/getDefaultAppVersion';

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  try {
    const accountId = CookieService.get<string>(ACCOUNT_COOKIE);

    let config = {};

    if (accountId) {
      config = await NotificationsService.getUserContactConfig(accountId);
    }

    return {
      props: {
        config,
        ...(await getTranslations(locale)),
        ...(await getDefaultAppVersion()),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export { default } from './NotificationsPage';
