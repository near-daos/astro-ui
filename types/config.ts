export type Config = {
  AWS_BUCKET: string;
  AWS_REGION: string;
  GOOGLE_ANALYTICS_KEY: string;
  LOG_ROCKET_APP_ID: string;
  DD_APPLICATION_ID: string;
  DD_CLIENT_TOKEN: string;
  DD_SERVICE: string;
  RELEASE_NOTES: string;
  I18_RELOAD_ON_PRERENDER: boolean;
  API_URL: string;
  STATS_API_URL: string;
  TOASTS_NOTIFICATIONS_TIMEOUT: number;
  APP_DOMAIN: string;
  NEAR_ENV: string;
  LOCAL_WALLET_REDIRECT: boolean;
  NEAR_CONTRACT_NAME: string;
  ROKETO_CONTRACT_NAME: string;
  ROKETO_MULTICALL_NAME: string;
  TOKEN_FACTORY_CONTRACT_NAME: string;
  LAUNCHDARKLY_ID: string;
  LAUNCHDARKLY_SDK_KEY: string;
  DRAFTS_API_URL: string;
  SEARCH_API_URL: string;
  OPEN_SEARCH_USERNAME: string;
  OPEN_SEARCH_PASSWORD: string;
  GENERIC_FACTORY_CONTRACT_NAME: string;
  STAKING_CONTRACT_BINARY_HASH: string;
};

export enum WalletType {
  NEAR,
  SENDER,
  SELECTOR_NEAR = 'my-near-wallet',
  SELECTOR_SENDER = 'sender',
}
