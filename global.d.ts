import React from 'react';
import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';
import { Config } from 'types/config';

type SputnikRequestSignInCompleted = (result: {
  accountId?: string;
  errorCode?: SputnikWalletErrorCodes;
  allKeys?: string;
  publicKey?: string;
}) => Promise<void>;

export type TransactionCompleted = {
  transactionHashes?: string;
  errorCode?: SputnikWalletErrorCodes;
};

export type SelectorTransactionCompleted = TransactionCompleted & {
  accountId: string;
};

type SputnikRequestSignTransactionCompleted = (
  result: TransactionCompleted
) => void;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric: any;
    onLogin?: () => Promise<unknown>;
    onTransaction?: (data: SelectorTransactionCompleted) => Promise<void>;
    sputnikRequestSignInCompleted?: SputnikRequestSignInCompleted;
    sputnikRequestSignTransactionCompleted?: SputnikRequestSignTransactionCompleted;
    opener: {
      sputnikRequestSignInCompleted?: SputnikRequestSignInCompleted;
      sputnikRequestSignTransactionCompleted?: SputnikRequestSignTransactionCompleted;
    };
    near: SenderWalletInstance;
    APP_CONFIG: Config;
    gtag: (
      type: 'event',
      name: string,
      params: Record<string, string | number | string[]>
    ) => void;
  }
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

declare module 'yup' {
  interface ArraySchema<T> {
    unique(
      message: string,
      mapper?: (value: T, index?: number, list?: T[]) => T[]
    ): ArraySchema<T>;
  }
}
