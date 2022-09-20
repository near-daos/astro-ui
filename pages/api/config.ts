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
    DD_APPLICATION_ID: process.env.DD_APPLICATION_ID,
    DD_CLIENT_TOKEN: process.env.DD_CLIENT_TOKEN,
    DD_SERVICE: process.env.DD_SERVICE,
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
    LAUNCHDARKLY_SDK_KEY: process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_KEY,
    ROKETO_CONTRACT_NAME: process.env.ROKETO_CONTRACT_NAME,
    ROKETO_MULTICALL_NAME: process.env.ROKETO_MULTICALL_NAME,
    DRAFTS_API_URL: process.env.DRAFTS_API_URL,
    SEARCH_API_URL: process.env.SEARCH_API_URL,
    OPEN_SEARCH_USERNAME: process.env.OPEN_SEARCH_USERNAME,
    OPEN_SEARCH_PASSWORD: process.env.OPEN_SEARCH_PASSWORD,
    GENERIC_FACTORY_CONTRACT_NAME: process.env.GENERIC_FACTORY_CONTRACT_NAME,
    STAKING_CONTRACT_BINARY_HASH: process.env.STAKING_CONTRACT_BINARY_HASH,
  };

  res.status(200).json(config);
}
