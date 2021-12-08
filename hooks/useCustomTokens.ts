import { useCallback, useState } from 'react';
import { useMount } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { Token } from 'types/token';
import reduce from 'lodash/reduce';
import { Tokens } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

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

export function useDaoCustomTokens(): { tokens: Record<string, Token> } {
  const router = useRouter();
  const [tokens, setTokens] = useState<Record<string, Token>>({});

  const prepareTokens = useCallback((tkns: Token[]) => {
    setTokens(normalizeTokens(tkns));
  }, []);

  useMount(() => {
    SputnikHttpService.getAccountTokens(router.query.dao as string).then(
      data => {
        prepareTokens(data);
      }
    );
  });

  return { tokens };
}

export function useAllCustomTokens(): { tokens: Record<string, Token> } {
  const [tokens, setTokens] = useState<Record<string, Token>>({});

  const prepareTokens = useCallback((tkns: Token[]) => {
    setTokens(normalizeTokens(tkns));
  }, []);

  useMount(() => {
    SputnikHttpService.getAllTokens().then(data => {
      prepareTokens(data);
    });
  });

  return { tokens };
}
