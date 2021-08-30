import { getNearConfig, NEAR_ENV } from './near';

export type { NearConfig } from './near';
export const nearConfig = getNearConfig(
  (process.env.NEXT_PUBLIC_NEAR_ENV as NEAR_ENV) || 'development'
);
export { awsConfig } from './aws';

export { firebaseConfig } from './firebase';

export const appConfig = {
  logoPath: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/',
  // todo refactor
  apiUrl: process.browser
    ? `${window.origin}/api/`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`,
  awsUseLocalConf: Boolean(
    JSON.parse(process.env.NEXT_PUBLIC_AWS_USE_LOCAL_CONF || 'false')
  )
};
