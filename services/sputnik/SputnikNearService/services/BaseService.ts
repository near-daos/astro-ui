import { configService } from 'services/ConfigService';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

export class BaseService {
  protected readonly walletService;

  protected readonly nearConfig;

  constructor(walletService: WalletService) {
    this.walletService = walletService;
    this.nearConfig = configService.get().nearConfig;
  }
}
