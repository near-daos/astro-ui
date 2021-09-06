declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fabric: any;
  sputnikRequestSignInCompleted: () => void;
  sputnikRequestSignTransactionCompleted?: (string) => void;
  opener: {
    sputnikRequestSignInCompleted?: () => void;
    sputnikRequestSignTransactionCompleted?: (string) => void;
  };
}
