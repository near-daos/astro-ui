/** https://stackoverflow.com/a/53981706 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_AWS_BUCKET: string;
      NEXT_PUBLIC_AWS_REGION: string;
      NEXT_PUBLIC_AWS_IDENTITY_POOL_ID: string;
      NEXT_PUBLIC_GOOGLE_ANALYTICS_KEY: string;

      NEXT_PUBLIC_APP_VERSION: string;
      NEXT_PUBLIC_CHANGELOG_URL: string;
      NEXT_PUBLIC_DEV_PROGRESS_URL: string;

      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_LOCAL_WALLET_REDIRECT: boolean;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
