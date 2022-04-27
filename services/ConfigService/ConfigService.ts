import { Config } from 'types/config';
import { getNearConfig, NearConfig } from 'config/near';
import { appConfig as APP_CONFIG } from 'config';

export class ConfigService {
  // eslint-disable-next-line class-methods-use-this
  public get(): { appConfig: Config; nearConfig: NearConfig } {
    const appConfig = process.browser ? window.APP_CONFIG : APP_CONFIG;

    const nearConfig = getNearConfig(appConfig);

    return {
      appConfig,
      nearConfig,
    };
  }
}

export const configService = new ConfigService();
