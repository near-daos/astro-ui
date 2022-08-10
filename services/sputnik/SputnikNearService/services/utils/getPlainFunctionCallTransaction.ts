import { GAS_VALUE } from 'services/sputnik/SputnikNearService/services/constants';

import { Transaction } from 'services/sputnik/SputnikNearService/walletServices/types';

type FcInput = {
  receiverId: string;
  methodName: string;
  args: Record<string, unknown>;
  gas?: string | number;
  deposit?: string;
};

export function getPlainFunctionCallTransaction(input: FcInput): Transaction {
  const { receiverId, methodName, args, gas, deposit } = input;

  return {
    receiverId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName,
          args,
          gas: (gas || GAS_VALUE)?.toString(),
          deposit: deposit || '0',
        },
      },
    ],
  } as Transaction;
}
