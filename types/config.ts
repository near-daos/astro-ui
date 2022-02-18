export type Config = {
  AWS_BUCKET: string;
  AWS_REGION: string;
  GOOGLE_ANALYTICS_KEY: string;
  RELEASE_NOTES: string;
  I18_RELOAD_ON_PRERENDER: boolean;
  API_URL: string;
  STATS_API_URL: string;
  TOASTS_NOTIFICATIONS_TIMEOUT: number;
  APP_DOMAIN: string;
  NEAR_ENV: string;
  LOCAL_WALLET_REDIRECT: boolean;
};

export type NearConfig = {
  walletFormat?: string;
  networkId: string;
  nodeUrl: string;
  contractName: string;
  tokenContractName: string;
  masterAccount?: string;
  walletUrl?: string;
  helperUrl?: string;
  explorerUrl?: string;
  keyPath?: string;
};
