import { Config } from 'types/config';
import { getNearConfig, NEAR_ENV, NearConfig } from 'config/near';
import { appConfig as APP_CONFIG } from 'config';

export class ConfigService {
  private readonly appConfig;

  private readonly nearConfig;

  constructor() {
    const config = process.browser ? window.APP_CONFIG : APP_CONFIG;

    this.appConfig = config;
    this.nearConfig = getNearConfig(
      (config?.NEAR_ENV || 'development') as NEAR_ENV
    );
  }

  public get(): { appConfig: Config; nearConfig: NearConfig } {
    return {
      appConfig: this.appConfig,
      nearConfig: this.nearConfig,
    };
  }
}

export const configService = new ConfigService();
