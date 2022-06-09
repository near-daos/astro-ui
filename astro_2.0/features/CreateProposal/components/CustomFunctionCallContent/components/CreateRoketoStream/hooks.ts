import { useCallback, useEffect, useState } from 'react';
import { Contract } from 'near-api-js';

import { useWalletContext } from 'context/WalletContext';
import { configService } from 'services/ConfigService';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

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
}

interface RoketoContract extends Contract {
  get_dao: () => Promise<RoketoDao>;
}

/* eslint-enable camelcase */

export function useRoketoTokens(): {
  loading: boolean;
  roketo: RoketoDao;
} {
  const { nearService } = useWalletContext();
  const [roketo, setRoketo] = useState<RoketoDao>({
    tokens: {},
    commission_unlisted: '0',
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
  const { loading, roketo } = useRoketoTokens();

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
