export { awsConfig } from './aws';

export const appConfig = {
  logoPath: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/',
  API_URL: process.browser
    ? '/api/server/v1/'
    : `${process.env.API_URL}/api/v1/`,
  LOCAL_WALLET_REDIRECT: process.env.LOCAL_WALLET_REDIRECT,
  AWS_USE_LOCAL_CONF: Boolean(
    JSON.parse(process.env.AWS_USE_LOCAL_CONF || 'false')
  ),
  STATS_API_URL: process.env.STATS_API_URL,
  APP_DOMAIN: process.env.APP_DOMAIN,
  LAUNCHDARKLY_ID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_ID,
  NEAR_ENV: process.env.NEAR_ENV,

  AWS_BUCKET: '',
  AWS_REGION: '',
  GOOGLE_ANALYTICS_KEY: '',
  RELEASE_NOTES: process.env.RELEASE_NOTES,
  I18_RELOAD_ON_PRERENDER: false,
  TOASTS_NOTIFICATIONS_TIMEOUT: 0,
};
