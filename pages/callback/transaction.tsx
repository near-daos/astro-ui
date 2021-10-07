import { NextPage } from 'next';
import { useEffect } from 'react';
import { SputnikService } from 'services/SputnikService';

const Transaction: NextPage = () => {
  useEffect(() => {
    const callback = window.opener?.sputnikRequestSignTransactionCompleted;

    if (typeof callback === 'function') {
      const transactionHashes = new URL(
        window.location.toString()
      ).searchParams.get('transactionHashes');

      SputnikService.init();
      callback?.(transactionHashes);

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      window.close();
    }
  }, []);

  return null;
};

export default Transaction;
