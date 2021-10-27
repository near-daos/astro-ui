export enum SputnikWalletErrorCodes {
  userRejected = 'userRejected',
  unknownError = 'unknownError',
}

const getErrorMessageByCode = (code?: SputnikWalletErrorCodes) => {
  if (code === SputnikWalletErrorCodes.userRejected) {
    return 'Wallet action was denied.';
  }

  return 'Something went wrong!';
};

export class SputnikWalletError extends Error {
  errorCode?: SputnikWalletErrorCodes;

  constructor(params: {
    errorCode?: SputnikWalletErrorCodes;
    message?: string;
  }) {
    super(params.message || getErrorMessageByCode(params.errorCode));

    this.name = 'SputnikWalletError';
    this.errorCode = params.errorCode;
  }
}
