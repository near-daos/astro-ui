declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fabric: any;
  sputnikRequestSignInCompleted: (accountID?: string | undefined) => void;
  sputnikRequestSignTransactionCompleted?: (string) => void;
  opener: {
    sputnikRequestSignInCompleted?: (accountID?: string | undefined) => void;
    sputnikRequestSignTransactionCompleted?: (string) => void;
  };
}
