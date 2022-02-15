import { Config } from 'types/config';

class ConfigService {
  private config: Config | null = null;

  public init(appConfig: Config): void {
    this.config = appConfig;
  }

  public get(): Config | null {
    return this.config;
  }
}

export const configService = new ConfigService();
