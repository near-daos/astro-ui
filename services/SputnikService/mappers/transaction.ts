import { formatYoktoValue } from 'helpers/format';
import { Transaction, TransactionType } from 'types/transaction';

type ReceiptAction = {
  receiptId: string;
  receiptPredecessorAccountId: string;
  receiptReceiverAccountId: string;
  actionKind: 'TRANSFER';
  args: {
    deposit: string;
  };
};

type Receipt = {
  receiptId: string;
  predecessorAccountId: string;
  receiverAccountId: string;
  originatedFromTransactionHash: string;
  includedInBlockTimestamp: string;
  receiptAction: ReceiptAction | null;
};

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
    actionKind: 'TRANSFER' | 'FUNCTION_CALL';
    args: {
      deposit: string;
      // eslint-disable-next-line camelcase
      method_name: string;
    };
    deposit: string;
    indexInTransaction: number;
  };
  transactionHash: string;
  receipts: Receipt[];
};

export type GetTransactionsResponse = {
  data: TransactionDTO[];
};

export function mapTransactionDTOToTransaction(
  data: TransactionDTO[]
): Transaction[] {
  return data.map(item => {
    let deposit = '0';
    let type = 'Deposit' as TransactionType;

    if (
      item.transactionAction.actionKind === 'FUNCTION_CALL' &&
      item.transactionAction.args.method_name === 'create'
    ) {
      deposit = formatYoktoValue(item.transactionAction.args.deposit);
    } else {
      type =
        item.transactionAction.actionKind === 'TRANSFER'
          ? 'Deposit'
          : 'Withdraw';

      if (type === 'Deposit') {
        deposit = formatYoktoValue(item.transactionAction.args.deposit);
      } else {
        const receipt = item.receipts.find(
          r => r.receiptAction?.actionKind === 'TRANSFER'
        );

        if (receipt && receipt.receiptAction?.args.deposit) {
          deposit = formatYoktoValue(receipt.receiptAction?.args.deposit);
        }
      }
    }

    return {
      transactionId: item.transactionHash,
      timestamp: Number(item.blockTimestamp) / 1000000,
      receiverAccountId: item.receiverAccountId,
      signerAccountId: item.signerAccountId,
      deposit,
      type,
      date: new Date(Number(item.blockTimestamp) / 1000000).toISOString()
    };
  });
}
