import { useCallback, useEffect, useState } from 'react';
import Decimal from 'decimal.js';

import { useWalletContext } from 'context/WalletContext';
import { configService } from 'services/ConfigService';
import { formatGasValue } from 'utils/format';

/* eslint-disable camelcase */
interface RoketoToken {
  account_id: string;
  is_payment: boolean;
  commission_on_create: string;
  commission_on_transfer: string;
  gas_for_ft_transfer: string;
  gas_for_storage_deposit: string;
}

type RoketoTokens = Record<string, RoketoToken>;

interface RoketoDao {
  tokens: RoketoTokens;
  commission_non_payment_ft: string;
}

interface RoketoContract {
  get_dao: () => Promise<RoketoDao>;
}

/* eslint-enable camelcase */

export function useRoketo(): {
  loading: boolean;
  roketo: RoketoContract | null;
} {
  const { nearService } = useWalletContext();
  const [roketo, setRoketo] = useState<RoketoContract | null>(null);
  const [loading, setLoading] = useState(true);
  const { appConfig } = configService.get();

  const getRoketo = useCallback(async () => {
    try {
      const accountId = nearService?.getAccountId();

      if (!appConfig || !accountId || !nearService) {
        return;
      }

      const contract = {
        get_dao: async () =>
          nearService.callContract<RoketoDao>(
            appConfig.ROKETO_CONTRACT_NAME,
            'get_dao',
            ''
          ),
      };

      setRoketo(contract);
    } finally {
      setLoading(false);
    }
  }, [appConfig, nearService]);

  useEffect(() => {
    (async () => {
      await getRoketo();
    })();
  }, [getRoketo]);

  return { loading, roketo };
}

function useRoketoDao(): { loading: boolean; roketoDao: RoketoDao } {
  const { loading: roketoLoading, roketo } = useRoketo();
  const [loading, setLoading] = useState(true);
  const [roketoDao, setRoketoDao] = useState<RoketoDao>({
    tokens: {},
    commission_non_payment_ft: '0',
  });

  const getDaoInfo = useCallback(async () => {
    try {
      const daoInfo = await roketo?.get_dao();

      if (daoInfo) {
        setRoketoDao(daoInfo);
      }
    } finally {
      setLoading(false);
    }
  }, [roketo]);

  useEffect(() => {
    (async () => {
      await getDaoInfo();
    })();
  }, [getDaoInfo]);

  if (loading || roketoLoading) {
    return { loading: true, roketoDao };
  }

  return { loading: false, roketoDao };
}

interface ReceiptPosition {
  token: 'NEAR' | string;
  amount: string;
  description: string;
}

type TokenId = string;
type Amount = string;
type TotalAmount = Record<TokenId, Amount>;

interface RoketoReceipt {
  positions: ReceiptPosition[];
  total: TotalAmount;
  actions: MulticallAction[];
}

/* eslint-disable camelcase */
interface MulticallAction {
  contract: string;
  method: string;
  args: Record<string, unknown>;
  deposit?: string;
  gas?: string;
}

/* eslint-enable camelcase */

function createStreamTransferCall({
  amountToStream,
  createCommission,
  daoId,
  receiverId,
  speedTokensPerSec,
  streamComment,
  tokenAccountId,
}: {
  amountToStream: string;
  createCommission: string;
  daoId: string;
  receiverId: string;
  speedTokensPerSec: string;
  streamComment: string;
  tokenAccountId: string;
}): MulticallAction {
  const config = configService.get();
  const streamingContract = config.appConfig.ROKETO_CONTRACT_NAME;

  const CreateStreamMessage = {
    Create: {
      request: {
        owner_id: daoId,
        receiver_id: receiverId,
        tokens_per_sec: speedTokensPerSec,
        description: streamComment,
        is_expirable: true,
        is_auto_start_enabled: true,
      },
    },
  };

  return {
    contract: tokenAccountId,
    method: 'ft_transfer_call',
    deposit: '1',
    gas: formatGasValue(150).toString(),
    args: {
      receiver_id: streamingContract,
      amount: new Decimal(amountToStream).plus(createCommission).toFixed(),
      memo: streamComment,
      msg: JSON.stringify(CreateStreamMessage),
    },
  };
}

export function useRoketoReceipt({
  amountToStream,
  daoId,
  tokenId,
  tokenDecimals,
  speedTokensPerSec,
  receiverId,
  streamComment,
  storageDeposit,
}: {
  amountToStream: string;
  daoId: string;
  tokenId: 'NEAR' | string;
  tokenDecimals: number;
  receiverId: string;
  streamComment: string;
  speedTokensPerSec: string;
  storageDeposit: {
    forSender: boolean;
    forRecipient: boolean;
  };
}): RoketoReceipt {
  const { roketoDao, loading } = useRoketoDao();
  const [positionsList, setPositionsList] = useState<ReceiptPosition[]>([]);
  const [actionsList, setActionsList] = useState<MulticallAction[]>([]);

  useEffect(() => {
    const positions: ReceiptPosition[] = [];
    const actions: MulticallAction[] = [];

    const wrap =
      roketoDao.tokens['wrap.near'] ?? roketoDao.tokens['wrap.testnet'];

    if (!wrap) {
      return;
    }

    if (tokenId === 'NEAR') {
      positions.push(
        {
          token: 'NEAR',
          amount: amountToStream,
          description: 'Amount to be streamed',
        },
        {
          token: 'NEAR',
          amount: wrap.commission_on_create,
          description: 'Stream creation fee',
        }
      );
      actions.push(
        // TODO: reenable when support contract will be available for RoketoStreaming
        // {
        //   contract: wrap.account_id,
        //   method: 'near_deposit',
        //   args: {},
        //   deposit: new Decimal(amountToStream)
        //     .plus(wrap.commission_on_create)
        //     .toFixed(),
        // },
        createStreamTransferCall({
          amountToStream,
          createCommission: wrap.commission_on_create,
          daoId,
          receiverId,
          speedTokensPerSec,
          streamComment,
          tokenAccountId: wrap.account_id,
        })
      );
    } else if (
      roketoDao.tokens[tokenId] &&
      roketoDao.tokens[tokenId].is_payment
    ) {
      const token = roketoDao.tokens[tokenId];

      positions.push(
        {
          token: tokenId,
          amount: amountToStream,
          description: 'Amount to be streamed',
        },
        {
          token: tokenId,
          amount: token.commission_on_create,
          description: 'Stream creation fee',
        }
      );
      actions.push(
        createStreamTransferCall({
          amountToStream,
          createCommission: token.commission_on_create,
          daoId,
          receiverId,
          speedTokensPerSec,
          streamComment,
          tokenAccountId: token.account_id,
        })
      );
    } else {
      positions.push(
        {
          token: tokenId,
          amount: amountToStream,
          description: 'Amount to be streamed',
        },
        {
          token: 'NEAR',
          amount: roketoDao.commission_non_payment_ft,
          description: 'Stream creation fee',
        }
      );

      const config = configService.get();
      const streamingContract = config.appConfig.ROKETO_CONTRACT_NAME;

      actions.push(
        {
          contract: streamingContract,
          method: 'account_deposit_near',
          args: {},
          deposit: roketoDao.commission_non_payment_ft,
        },
        createStreamTransferCall({
          amountToStream,
          createCommission: '0',
          daoId,
          receiverId,
          speedTokensPerSec,
          streamComment,
          tokenAccountId: tokenId,
        })
      );
    }

    const storageDepositFee = new Decimal('0.00125').mul(10 ** 24).toFixed();

    if (storageDeposit.forRecipient) {
      positions.push({
        token: 'NEAR',
        amount: storageDepositFee,
        description: 'Storage deposit fee for the recipient',
      });
      actions.unshift({
        contract: tokenId === 'NEAR' ? wrap.account_id : tokenId,
        method: 'storage_deposit',
        args: { account_id: receiverId },
        deposit: storageDepositFee,
      });
    }

    if (storageDeposit.forSender) {
      positions.push({
        token: 'NEAR',
        amount: storageDepositFee,
        description: 'Storage deposit fee for the sender',
      });
      actions.unshift({
        contract: tokenId === 'NEAR' ? wrap.account_id : tokenId,
        method: 'storage_deposit',
        args: { account_id: daoId },
        deposit: storageDepositFee,
      });
    }

    setPositionsList(positions);
    setActionsList(actions);
  }, [
    daoId,
    amountToStream,
    roketoDao,
    storageDeposit.forRecipient,
    storageDeposit.forSender,
    receiverId,
    streamComment,
    speedTokensPerSec,
    tokenDecimals,
    tokenId,
  ]);

  const [totalCharges, setTotalCharges] = useState<Record<TokenId, Amount>>({});

  useEffect(() => {
    const totalPerToken: Record<string, Decimal> = {};

    positionsList.forEach(position => {
      if (!totalPerToken[position.token]) {
        totalPerToken[position.token] = new Decimal('0');
      }

      totalPerToken[position.token] = totalPerToken[position.token].plus(
        position.amount
      );
    });

    const total: TotalAmount = Object.fromEntries(
      Object.entries(totalPerToken).map(([token, decimal]) => [
        token,
        decimal.toFixed(),
      ])
    );

    setTotalCharges(total);
  }, [positionsList]);

  if (loading || amountToStream === '0') {
    return { positions: [], total: {}, actions: [] };
  }

  return {
    positions: positionsList,
    total: totalCharges,
    actions: actionsList,
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useRoketoStorageDeposit(
  account: string,
  tokenAccount: string
): { loading: boolean; hasStorage: boolean } {
  const { nearService } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [hasStorage, setHasStorage] = useState(false);
  const accountToCheck = useDebounce(account, 500);

  const getIsRegistered = useCallback(
    async (accountId: string, tokenAccountId: string) => {
      try {
        if (!accountId || accountId.trim().length < 5 || !tokenAccountId) {
          return;
        }

        if (tokenAccountId === 'NEAR') {
          setHasStorage(true);

          return;
        }

        setLoading(true);

        const balance = await nearService?.callContract<{
          total: string;
          available: string;
        }>(tokenAccountId, 'storage_balance_of', '');

        setHasStorage(Boolean(balance && balance.total !== '0'));
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    },
    [nearService]
  );

  useEffect(() => {
    (async () => {
      await getIsRegistered(accountToCheck, tokenAccount);
    })();
  }, [getIsRegistered, accountToCheck, tokenAccount]);

  return { loading, hasStorage };
}
