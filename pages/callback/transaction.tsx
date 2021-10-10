import { NextPage } from 'next';
import { useEffect } from 'react';

const Transaction: NextPage = () => {
  useEffect(() => {
    const callback = window.opener?.sputnikRequestSignTransactionCompleted;

    if (typeof callback === 'function') {
      const { searchParams } = new URL(window.location.toString());
      const transactionHashes = searchParams.get('transactionHashes');
      const errorCode = searchParams.get('errorCode');

      if (transactionHashes) {
        callback?.({ transactionHashes });
      } else if (errorCode) {
        callback?.({ errorCode });
      } else {
        callback?.({ errorCode: 'unknown' });
      }

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
