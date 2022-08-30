import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { configService } from 'services/ConfigService';
import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';
import { WalletSelectorService } from 'services/sputnik/SputnikNearService/walletServices/WalletSelectorService';
import { WalletType } from 'types/config';

export async function initWalletSelector(
  walletType: WalletType
): Promise<WalletService> {
  const { nearConfig } = configService.get();

  const s = await setupWalletSelector({
    network: nearConfig.networkId as NetworkId,
    modules: [setupMyNearWallet(), setupSender()],
  });

  const wallet = await s.wallet(walletType as string);

  return new WalletSelectorService(wallet, s);
}
