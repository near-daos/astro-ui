import { WalletSelector } from '@near-wallet-selector/core';

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
  ROKETO_CONTRACT_NAME: string;
  ROKETO_MULTICALL_NAME: string;
  TOKEN_FACTORY_CONTRACT_NAME: string;
  LAUNCHDARKLY_ID: string;
  DRAFTS_API_URL: string;
  GENERIC_FACTORY_CONTRACT_NAME: string;
  STAKING_CONTRACT_BINARY_HASH: string;
};

export enum WalletType {
  NEAR,
  SENDER,
  SELECTOR_NEAR = 'near-wallet',
  SELECTOR_SENDER = 'sender',
}

export type LoginResponse = {
  error?: Error;
  selector?: WalletSelector;
};
