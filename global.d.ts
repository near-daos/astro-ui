import React from 'react';
import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';
import { Config } from 'types/config';

type SputnikRequestSignInCompleted = (result: {
  accountId?: string;
  errorCode?: SputnikWalletErrorCodes;
  allKeys?: string;
  publicKey?: string;
}) => Promise<void>;

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
    near: SenderWalletInstance;
    APP_CONFIG: Config;
  }
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
