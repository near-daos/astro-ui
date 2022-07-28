import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

import { configService } from 'services/ConfigService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/walletServices/SputnikWalletService';

export function initNearWallet(): Promise<WalletService> {
  const { nearConfig } = configService.get();

  return Promise.resolve(new SputnikWalletService(nearConfig));
}
