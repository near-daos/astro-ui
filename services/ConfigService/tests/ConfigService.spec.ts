import { Config, NearConfig } from 'types/config';

import { configService } from 'services/ConfigService';

describe('ConfigService', () => {
  it('Should init service with config', () => {
    const appConfig = ('App Config' as unknown) as Config;
    const nearConfig = ('Near Config' as unknown) as NearConfig;

    configService.init(nearConfig, appConfig);

    expect(configService.get()).toEqual({
      appConfig,
      nearConfig,
    });
  });
});
