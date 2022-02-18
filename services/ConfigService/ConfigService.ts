import { Config, NearConfig } from 'types/config';

class ConfigService {
  private appConfig: Config | null = null;

  private nearConfig: NearConfig | null = null;

  public init(nearConfig: NearConfig, appConfig: Config): void {
    this.appConfig = appConfig;
    this.nearConfig = nearConfig;
  }

  public get(): { appConfig: Config | null; nearConfig: NearConfig | null } {
    return {
      appConfig: this.appConfig,
      nearConfig: this.nearConfig,
    };
  }
}

export const configService = new ConfigService();
