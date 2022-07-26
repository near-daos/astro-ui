import LaunchDarkly, { LDClient } from 'launchdarkly-node-server-sdk';
import { configService } from 'services/ConfigService';

let launchDarklyClient: LDClient;

async function initialize() {
  const { appConfig } = configService.get();

  const client = LaunchDarkly.init(appConfig.LAUNCHDARKLY_SDK_KEY);

  await client.waitForInitialization();

  return client;
}

export async function getClient(): Promise<LDClient> {
  if (launchDarklyClient) {
    return launchDarklyClient;
  }

  launchDarklyClient = await initialize();

  return launchDarklyClient;
}
