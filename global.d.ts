import React from 'react';

import { Config, LoginResponse } from 'types/config';

import { SputnikWalletErrorCodes } from 'errors/SputnikWalletError';

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
    onLogin?: (response: LoginResponse) => Promise<unknown>;
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
