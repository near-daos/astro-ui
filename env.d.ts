/** https://stackoverflow.com/a/53981706 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_BUCKET: string;
      AWS_REGION: string;
      AWS_IDENTITY_POOL_ID: string;
      GOOGLE_ANALYTICS_KEY: string;
      LOG_ROCKET_APP_ID: string;
      DD_APPLICATION_ID: string;
      DD_CLIENT_TOKEN: string;
      DD_SERVICE: string;

      APP_VERSION: string;
      CHANGELOG_URL: string;
      DEV_PROGRESS_URL: string;

      API_URL: string;
      STATS_API_URL;
      DRAFTS_API_URL: string;
      SEARCH_API_URL: string;
      APP_DOMAIN: string;
      LOCAL_WALLET_REDIRECT: boolean;

      NEAR_CONTRACT_NAME: string;
      ROKETO_CONTRACT_NAME: string;
      ROKETO_MULTICALL_NAME: string;
      TOKEN_FACTORY_CONTRACT_NAME: string;

      RELEASE_NOTES: string;
      TOASTS_NOTIFICATIONS_TIMEOUT: number;
      I18_RELOAD_ON_PRERENDER: boolean;

      NEXT_PUBLIC_LAUNCHDARKLY_ID: string;
      NEXT_PUBLIC_LAUNCHDARKLY_SDK_KEY: string;

      OPEN_SEARCH_USERNAME: string;
      OPEN_SEARCH_PASSWORD: string;

      GENERIC_FACTORY_CONTRACT_NAME: string;
      STAKING_CONTRACT_BINARY_HASH: string;

      NEAR_ENV: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
