import { WalletType } from 'types/config';

export type PkAndSignature =
  | { publicKey: string | null; signature: string | null }
  | Record<string, never>;

export type WalletAccount = {
  acc: string;
  walletType: WalletType;
};
