import { WalletType } from 'types/config';

export function isSelectorWalletType(walletType: WalletType): boolean {
  return (
    walletType === WalletType.SELECTOR_NEAR ||
    walletType === WalletType.SELECTOR_SENDER
  );
}
