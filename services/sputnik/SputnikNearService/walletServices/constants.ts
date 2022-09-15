import { WalletType } from 'types/config';
import { WalletMeta } from './types';

export const NEAR_WALLET_METADATA: WalletMeta = {
  name: 'NEAR',
  type: 'web',
  url: 'wallet.near.org',
  id: WalletType.NEAR,
};

export const SENDER_WALLET_METADATA: WalletMeta = {
  name: 'Sender',
  type: 'extension',
  url: 'senderwallet.io',
  id: WalletType.SENDER,
};
