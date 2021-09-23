import { formatYoktoValue } from 'helpers/format';
import { Transaction } from 'types/transaction';

export type TransactionDTO = {
  blockTimestamp: string;
  convertedIntoReceiptId: string;
  includedInBlockHash: string;
  includedInChunkHash: string;
  indexInChunk: number;
  nonce: string;
  receiptConversionGasBurnt: string;
  receiptConversionTokensBurnt: string;
  receiverAccountId: string;
  signature: string;
  signerAccountId: string;
  signerPublicKey: string;
  status: string;
  transactionAction: {
    actionKind: 'TRANSFER';
    args: {
      deposit: string;
    };
    deposit: string;
    indexInTransaction: number;
  };
  transactionHash: string;
};

export type GetTransactionsResponse = {
  data: TransactionDTO[];
};

export function mapTransactionDTOToTransaction(
  data: TransactionDTO[],
  daoId?: string
): Transaction[] {
  return data.map(item => {
    return {
      transactionId: item.transactionHash,
      timestamp: Number(item.blockTimestamp) / 1000000,
      receiverAccountId: item.receiverAccountId,
      signerAccountId: item.signerAccountId,
      deposit: formatYoktoValue(item.transactionAction.args.deposit),
      type: daoId === item.receiverAccountId ? 'Deposit' : 'Withdraw',
      date: new Date(Number(item.blockTimestamp) / 1000000).toISOString()
    };
  });
}
