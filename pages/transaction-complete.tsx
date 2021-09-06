import { useEffect } from 'react';
import { SputnikService } from 'services/SputnikService';

const TransactionComplete: React.FC = () => {
  useEffect(() => {
    const callback = window.opener?.sputnikRequestSignTransactionCompleted;

    if (typeof callback === 'function') {
      const transactionHashes = new URL(
        window.location.toString()
      ).searchParams.get('transactionHashes');

      SputnikService.init().then(() => callback?.(transactionHashes));

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      window.close();
    }
  }, []);

  return null;
};

export default TransactionComplete;
