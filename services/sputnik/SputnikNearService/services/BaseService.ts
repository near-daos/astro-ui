import { configService } from 'services/ConfigService';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

export class BaseService {
  protected readonly walletService;

  protected readonly nearConfig;

  protected readonly appConfig;

  constructor(walletService: WalletService) {
    this.walletService = walletService;

    const { nearConfig, appConfig } = configService.get();

    this.nearConfig = nearConfig;
    this.appConfig = appConfig;
  }
}
