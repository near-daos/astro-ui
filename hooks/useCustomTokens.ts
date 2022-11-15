import { useEffect, useMemo, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { Token } from 'types/token';
import reduce from 'lodash/reduce';
import { Tokens } from 'context/types';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useTokens } from 'services/ApiService/hooks/useTokens';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useDao } from 'services/ApiService/hooks/useDao';

function normalizeTokens(tkns: Token[]): Tokens {
  const hasNear = tkns.find(item => !item.tokenId);

  const input = hasNear
    ? tkns
    : [
        ...tkns,
        {
          symbol: 'NEAR',
          balance: '',
          decimals: 24,
          tokenId: '',
          icon: '',
          id: 'NEAR',
          price: null,
        },
      ];

  return reduce(
    input,
    (acc, token) => {
      const { tokenId, symbol } = token;

      acc[tokenId || symbol] = token;

      return acc;
    },
    {} as Tokens
  );
}

export function useDaoCustomTokens(daoId?: string): {
  tokens: Record<string, Token>;
} {
  const router = useRouter();
  const [tokensData, setTokensData] = useState<Token[]>();
  const { useOpenSearchDataApi } = useFlags();
  const { dao } = useDao();

  useEffect(() => {
    if (
      (!daoId && !router.query.dao) ||
      useOpenSearchDataApi ||
      useOpenSearchDataApi === undefined
    ) {
      return;
    }

    SputnikHttpService.getAccountTokens(daoId ?? (router.query.dao as string))
      .then(d => {
        setTokensData(d);
      })
      .catch(err => {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: err.message,
        });
      });
  }, [daoId, router.query.dao, useOpenSearchDataApi]);

  const tokens = useMemo(() => {
    const values = tokensData || dao?.tokens;

    return values ? normalizeTokens(values) : {};
  }, [dao?.tokens, tokensData]);

  return { tokens };
}

export function useAllCustomTokens(): { tokens: Record<string, Token> } {
  const [tokensData, setTokensData] = useState<Token[]>();
  const { useOpenSearchDataApi } = useFlags();
  const { data } = useTokens();

  useEffect(() => {
    if (useOpenSearchDataApi || useOpenSearchDataApi === undefined) {
      return;
    }

    SputnikHttpService.getTokens({
      limit: 1000,
    }).then(d => {
      setTokensData(d);
    });
  }, [useOpenSearchDataApi]);

  const tokens = useMemo(() => {
    const values = tokensData || data;

    return values ? normalizeTokens(values) : {};
  }, [data, tokensData]);

  return { tokens };
}
