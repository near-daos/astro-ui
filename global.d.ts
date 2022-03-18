import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';
import { Config } from 'types/config';

type SputnikRequestSignInCompleted = (result: {
  accountId?: string;
  errorCode?: SputnikWalletErrorCodes;
}) => void;

type SputnikRequestSignTransactionCompleted = (result: {
  transactionHashes?: string;
  errorCode?: SputnikWalletErrorCodes;
}) => void;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric: any;
    sputnikRequestSignInCompleted?: SputnikRequestSignInCompleted;
    sputnikRequestSignTransactionCompleted?: SputnikRequestSignTransactionCompleted;
    opener: {
      sputnikRequestSignInCompleted?: SputnikRequestSignInCompleted;
      sputnikRequestSignTransactionCompleted?: SputnikRequestSignTransactionCompleted;
    };
    APP_CONFIG: Config;
  }
}
