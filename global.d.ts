type sputnikRequestSignInCompleted = (result: {
  accountId?: string;
  errorCode?: string;
}) => void;

type sputnikRequestSignTransactionCompleted = (result: {
  transactionHashes?: string;
  errorCode?: string;
}) => void;

declare interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fabric: any;
  sputnikRequestSignInCompleted?: sputnikRequestSignInCompleted;
  sputnikRequestSignTransactionCompleted?: sputnikRequestSignTransactionCompleted;
  opener: {
    sputnikRequestSignInCompleted?: sputnikRequestSignInCompleted;
    sputnikRequestSignTransactionCompleted?: sputnikRequestSignTransactionCompleted;
  };
}
