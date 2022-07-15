import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

import { configService } from 'services/ConfigService';
import { SputnikWalletService } from 'services/sputnik/SputnikNearService/walletServices/SputnikWalletService';

export function initNearWallet(): WalletService {
  const { nearConfig } = configService.get();

  return new SputnikWalletService(nearConfig);
}
