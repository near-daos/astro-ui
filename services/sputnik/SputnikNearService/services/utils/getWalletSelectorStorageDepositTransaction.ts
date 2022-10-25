import { Transaction } from 'services/sputnik/SputnikNearService/walletServices/types';

import { GAS_VALUE } from 'services/sputnik/SputnikNearService/services/constants';

import { getPlainFunctionCallTransaction } from './getPlainFunctionCallTransaction';

export function getWalletSelectorStorageDepositTransaction(
  receiverId: string,
  accountId: string,
  registrationOnly = true
): Transaction {
  return getPlainFunctionCallTransaction({
    receiverId,
    methodName: 'storage_deposit',
    args: {
      account_id: accountId,
      registration_only: registrationOnly,
    },
    gas: GAS_VALUE?.toString(),
    deposit: '100000000000000000000000',
  });
}
