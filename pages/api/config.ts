// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Config } from 'types/config';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Config>
): void {
  const config: Config = {
    TOKEN_FACTORY_CONTRACT_NAME: process.env.TOKEN_FACTORY_CONTRACT_NAME,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_REGION: process.env.AWS_REGION,
    GOOGLE_ANALYTICS_KEY: process.env.GOOGLE_ANALYTICS_KEY,
    LOG_ROCKET_APP_ID: process.env.LOG_ROCKET_APP_ID,
    RELEASE_NOTES: process.env.RELEASE_NOTES,
    I18_RELOAD_ON_PRERENDER: process.env.I18_RELOAD_ON_PRERENDER,
    LOCAL_WALLET_REDIRECT: process.env.LOCAL_WALLET_REDIRECT,
    API_URL: process.env.API_URL,
    STATS_API_URL: process.env.STATS_API_URL,
    TOASTS_NOTIFICATIONS_TIMEOUT: process.env.TOASTS_NOTIFICATIONS_TIMEOUT,
    APP_DOMAIN: process.env.APP_DOMAIN,
    NEAR_ENV: process.env.NEAR_ENV,
    NEAR_CONTRACT_NAME: process.env.NEAR_CONTRACT_NAME,
    LAUNCHDARKLY_ID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_ID,
  };

  res.status(200).json(config);
}
