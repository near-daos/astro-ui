import { useCallback, useEffect, useState } from 'react';
import { Contract } from 'near-api-js';
import Decimal from 'decimal.js';

import { useWalletContext } from 'context/WalletContext';
import { configService } from 'services/ConfigService';

/* eslint-disable camelcase */
interface RoketoToken {
  account_id: string;
  is_listed: boolean;
  commission_on_create: string;
  commission_on_transfer: string;
  gas_for_ft_transfer: string;
  gas_for_storage_deposit: string;
}

type RoketoTokens = Record<string, RoketoToken>;

interface RoketoDao {
  tokens: RoketoTokens;
  commission_unlisted: string;
  commission_non_payment_ft: string;
}

interface RoketoContract extends Contract {
  get_dao: () => Promise<RoketoDao>;
}

interface FTContract extends Contract {
  storage_balance_of: (options: {
    account_id: string;
  }) => Promise<{ total: string; available: string }>;
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
      const account = nearService?.getAccount();

      if (!appConfig || !account) {
        return;
      }

      const contract = new Contract(account, appConfig.ROKETO_CONTRACT_NAME, {
        viewMethods: ['get_dao'],
        changeMethods: [],
      }) as RoketoContract;

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
    commission_unlisted: '0',
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
}

export function useRoketoReceipt({
  amountToStream,
  tokenId,
  tokenDecimals,
  storageDeposit,
}: {
  amountToStream: string;
  tokenId: 'NEAR' | string;
  tokenDecimals: number;
  storageDeposit: {
    forSender: boolean;
    forRecipient: boolean;
  };
}): RoketoReceipt {
  const { roketoDao, loading } = useRoketoDao();
  const [positionsList, setPositionsList] = useState<ReceiptPosition[]>([]);

  useEffect(() => {
    const positions: ReceiptPosition[] = [];

    if (tokenId === 'NEAR') {
      const wrap =
        roketoDao.tokens['wrap.near'] ?? roketoDao.tokens['wrap.testnet'];

      if (!wrap) {
        return;
      }

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
    } else if (roketoDao.tokens[tokenId]) {
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
    } else {
      positions.push(
        {
          token: tokenId,
          amount: amountToStream,
          description: 'Amount to be streamed',
        },
        {
          token: 'NEAR',
          amount:
            roketoDao.commission_unlisted ??
            roketoDao.commission_non_payment_ft,
          description: 'Stream creation fee',
        }
      );
    }

    const storageDepositFee = new Decimal('0.00125').mul(10 ** 24).toFixed();

    if (storageDeposit.forRecipient) {
      positions.push({
        token: 'NEAR',
        amount: storageDepositFee,
        description: 'Storage deposit fee for the recipient',
      });
    }

    if (storageDeposit.forSender) {
      positions.push({
        token: 'NEAR',
        amount: storageDepositFee,
        description: 'Storage deposit fee for the sender',
      });
    }

    setPositionsList(positions);
  }, [
    amountToStream,
    roketoDao,
    storageDeposit.forRecipient,
    storageDeposit.forSender,
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
    return { positions: [], total: {} };
  }

  return { positions: positionsList, total: totalCharges };
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
  const nearAccount = nearService?.getAccount();

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

        if (!nearAccount) {
          return;
        }

        const contract = new Contract(nearAccount, tokenAccountId, {
          viewMethods: ['storage_balance_of'],
          changeMethods: [],
        }) as FTContract;

        const balance = await contract.storage_balance_of({
          account_id: accountId,
        });

        setHasStorage(Boolean(balance && balance.total !== '0'));
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    },
    [nearAccount]
  );

  useEffect(() => {
    (async () => {
      await getIsRegistered(accountToCheck, tokenAccount);
    })();
  }, [getIsRegistered, accountToCheck, tokenAccount]);

  return { loading, hasStorage };
}
