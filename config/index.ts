import { getNearConfig, NEAR_ENV } from './near';

export type { NearConfig } from './near';
export const nearConfig = getNearConfig(
  (process.env.NEAR_ENV as NEAR_ENV) || 'development'
);
export { awsConfig } from './aws';

export const appConfig = {
  logoPath: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/',
  // todo refactor
  apiUrl: process.browser
    ? '/api/server/v1/'
    : `${process.env.API_URL}/api/v1/`,
  walletUseLocalRedirect: process.env.LOCAL_WALLET_REDIRECT,
  awsUseLocalConf: Boolean(
    JSON.parse(process.env.AWS_USE_LOCAL_CONF || 'false')
  ),
  statsApiUrl: `${process.env.STATS_API_URL}/api/v1/`,
  socketUrl: process.env.API_URL,
  toastsNotificationsTimeout: process.env.TOASTS_NOTIFICATIONS_TIMEOUT,
  appDomain: process.env.APP_DOMAIN,
};
