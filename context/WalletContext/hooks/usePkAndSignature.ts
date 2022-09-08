import { useEffect, useState } from 'react';

import { WalletService } from 'services/sputnik/SputnikNearService/walletServices/types';

import { PkAndSignature } from 'context/WalletContext/types';

export const usePkAndSignature = (
  currentWallet: WalletService | null
): PkAndSignature | null => {
  const [pkAndSignature, setPkAndSignature] = useState<PkAndSignature | null>(
    null
  );

  useEffect(() => {
    if (!currentWallet) {
      return;
    }

    const getPkAndSignature = async () => {
      const [publicKey, signature] = await Promise.all([
        currentWallet.getPublicKey(),
        currentWallet.getSignature(),
      ]);

      setPkAndSignature({
        publicKey,
        signature,
      });
    };

    getPkAndSignature().catch(console.error);
  }, [currentWallet]);

  return pkAndSignature;
};
