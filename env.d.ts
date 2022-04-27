/** https://stackoverflow.com/a/53981706 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_BUCKET: string;
      AWS_REGION: string;
      AWS_IDENTITY_POOL_ID: string;
      GOOGLE_ANALYTICS_KEY: string;

      APP_VERSION: string;
      CHANGELOG_URL: string;
      DEV_PROGRESS_URL: string;

      API_URL: string;
      STATS_API_URL;
      APP_DOMAIN: string;
      LOCAL_WALLET_REDIRECT: boolean;

      NEAR_CONTRACT_NAME: string;

      RELEASE_NOTES: string;
      TOASTS_NOTIFICATIONS_TIMEOUT: number;
      I18_RELOAD_ON_PRERENDER: boolean;

      NEAR_ENV: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
