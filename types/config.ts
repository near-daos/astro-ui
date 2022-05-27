export type Config = {
  AWS_BUCKET: string;
  AWS_REGION: string;
  GOOGLE_ANALYTICS_KEY: string;
  LOG_ROCKET_APP_ID: string;
  RELEASE_NOTES: string;
  I18_RELOAD_ON_PRERENDER: boolean;
  API_URL: string;
  STATS_API_URL: string;
  TOASTS_NOTIFICATIONS_TIMEOUT: number;
  APP_DOMAIN: string;
  NEAR_ENV: string;
  LOCAL_WALLET_REDIRECT: boolean;
  NEAR_CONTRACT_NAME: string;
  TOKEN_FACTORY_CONTRACT_NAME: string;
};

export enum WalletType {
  NEAR,
  SENDER,
}
