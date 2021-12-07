import { Receipt, TransactionType } from 'types/transaction';

/* eslint-disable camelcase */
type ReceiptAction = {
  receiptId: string;
  receiptPredecessorAccountId: string;
  receiptReceiverAccountId: string;
  actionKind: 'TRANSFER';
  args: {
    deposit: string;
    method_name?: string;
    args_json?: {
      memo: string;
      amount: string;
      receiver_id: string;
    };
  };
};
/* eslint-enable camelcase */

export type ReceiptDTO = {
  receiptId: string;
  predecessorAccountId: string;
  receiverAccountId: string;
  originatedFromTransactionHash: string;
  includedInBlockTimestamp: string;
  receiptActions: ReceiptAction[];
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
  receipts: ReceiptDTO[];
};

export type GetTransactionsResponse = {
  data: TransactionDTO[];
};

export type GetAccountReceiptsResponse = {
  data: ReceiptDTO[];
};

export type FTTokenReceipts = {
  tokenId: string;
  data: Receipt[];
};

const EXCLUDE_METHODS = [
  'act_proposal',
  'ft_transfer',
  'storage_deposit',
  'new',
];

export const mapReceiptsResponse = (
  accountId: string,
  data: ReceiptDTO[]
): Receipt[] => {
  const nearReceipts = data.reduce((res, item) => {
    let deposit = '';
    let type = 'Deposit' as TransactionType;

    if (item) {
      if (!item.receiptActions || !item.receiptActions.length) {
        return res;
      }

      const timestamp = Number(item.includedInBlockTimestamp) / 1000000;
      const date = new Date(
        Number(item.includedInBlockTimestamp) / 1000000
      ).toISOString();

      const actions = item.receiptActions.reduce((acc, k) => {
        if (
          !k ||
          !k.args ||
          !k.args.deposit ||
          k.receiptPredecessorAccountId === 'system' ||
          EXCLUDE_METHODS.includes(k.args.method_name ?? '')
        ) {
          return acc;
        }

        if (k.args.method_name === 'add_proposal') {
          type = 'Deposit';
          deposit = k.args.deposit;
        } else if (item.predecessorAccountId === accountId && k.args.deposit) {
          type = 'Withdraw';
          deposit = k.args.deposit;
        } else if (item.receiverAccountId === accountId && k.args?.deposit) {
          type = 'Deposit';
          deposit = k.args.deposit;
        }

        if (deposit) {
          acc.push({
            receiptId: item.receiptId,
            timestamp,
            receiverAccountId: item.receiverAccountId,
            predecessorAccountId: item.predecessorAccountId,
            deposit,
            type,
            txHash: item.originatedFromTransactionHash,
            date,
            token: 'NEAR',
          });
        }

        return acc;
      }, [] as Receipt[]);

      res.push(...actions);
    }

    return res;
  }, [] as Receipt[]);

  return nearReceipts;
};

export const mapReceiptsByTokenResponse = (
  accountId: string,
  tokenId: string,
  data: ReceiptDTO[]
): Receipt[] => {
  const receipts = data.reduce((res, item) => {
    let deposit = '';
    let type = 'Deposit' as TransactionType;

    if (item) {
      if (!item.receiptActions || !item.receiptActions.length) {
        return res;
      }

      const timestamp = Number(item.includedInBlockTimestamp) / 1000000;
      const date = new Date(
        Number(item.includedInBlockTimestamp) / 1000000
      ).toISOString();

      const actions = item.receiptActions.reduce((acc, k) => {
        if (
          !k ||
          !k.args ||
          !k.args.deposit ||
          k.receiptPredecessorAccountId === 'system' ||
          k.args.method_name !== 'ft_transfer'
        ) {
          return acc;
        }

        if (k.args.args_json?.receiver_id === accountId) {
          type = 'Deposit';
          deposit = k.args.args_json?.amount ?? '';
        } else if (k.args.args_json?.receiver_id) {
          type = 'Withdraw';
          deposit = k.args.args_json?.amount ?? '';
        }

        if (deposit) {
          acc.push({
            date,
            timestamp,
            type,
            deposit,
            receiptId: item.receiptId,
            receiverAccountId: item.receiverAccountId,
            predecessorAccountId: item.predecessorAccountId,
            txHash: item.originatedFromTransactionHash,
            token: item.receiverAccountId,
          });
        }

        return acc;
      }, [] as Receipt[]);

      res.push(...actions);
    }

    return res;
  }, [] as Receipt[]);

  return receipts;
};
