import { useCallback, useEffect, useState } from 'react';
import { Contract } from 'near-api-js';

import { useWalletContext } from 'context/WalletContext';
import { configService } from 'services/ConfigService';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import Decimal from 'decimal.js';

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

/* eslint-enable camelcase */

export function useRoketo(): {
  loading: boolean;
  roketo: RoketoDao;
} {
  const { nearService } = useWalletContext();
  const [roketo, setRoketo] = useState<RoketoDao>({
    tokens: {},
    commission_unlisted: '0',
    commission_non_payment_ft: '0',
  });
  const [loading, setLoading] = useState(true);
  const { appConfig } = configService.get();

  const getRoketoInfo = useCallback(async () => {
    try {
      const account = nearService?.getAccount();

      if (!appConfig || !account) {
        return;
      }

      const contract = new Contract(account, appConfig.ROKETO_CONTRACT_NAME, {
        viewMethods: ['get_dao'],
        changeMethods: [],
      }) as RoketoContract;

      const info = await contract.get_dao();

      setRoketo(info);
    } finally {
      setLoading(false);
    }
  }, [appConfig, nearService]);

  useEffect(() => {
    (async () => {
      await getRoketoInfo();
    })();
  }, [getRoketoInfo]);

  return { loading, roketo };
}

export function useRoketoCreateCommission(
  tokenId: string
): { amount: string; inToken: string } {
  const { loading, roketo } = useRoketo();

  if (loading) {
    return { amount: '0', inToken: tokenId };
  }

  const found = roketo.tokens[tokenId];

  if (!found) {
    return {
      amount: formatNearAmount(roketo.commission_unlisted),
      inToken: 'NEAR',
    };
  }

  return {
    amount: formatNearAmount(found.commission_on_create),
    inToken: tokenId,
  };
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
  storageDeposit,
}: {
  amountToStream: string;
  tokenId: 'NEAR' | string;
  storageDeposit: {
    forSender: boolean;
    forRecipient: boolean;
  };
}): RoketoReceipt {
  const { roketo, loading } = useRoketo();

  if (loading || amountToStream === '0') {
    return { positions: [], total: {} };
  }

  const positions: ReceiptPosition[] = [];

  if (tokenId === 'NEAR') {
    const wrap = roketo.tokens['wrap.near'] ?? roketo.tokens['wrap.testnet'];

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
  } else if (roketo.tokens[tokenId]) {
    const token = roketo.tokens[tokenId];

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
        amount: roketo.commission_unlisted,
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

  const totalDecimals: Record<string, Decimal> = {};

  positions.forEach(position => {
    if (!totalDecimals[position.token]) {
      totalDecimals[position.token] = new Decimal('0');
    }

    totalDecimals[position.token] = totalDecimals[position.token].plus(
      position.amount
    );
  });

  const total: TotalAmount = Object.fromEntries(
    Object.entries(totalDecimals).map(([token, decimal]) => [
      token,
      decimal.toFixed(),
    ])
  );

  return { positions, total };
}
