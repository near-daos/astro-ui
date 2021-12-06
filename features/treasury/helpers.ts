import { Receipt } from 'types/transaction';
import { ChartData } from 'types/chart';
import { formatYoktoValue } from 'helpers/format';
import { Token } from 'types/token';
import { useCallback, useEffect, useState } from 'react';
import { SputnikHttpService } from 'services/sputnik';

export function getChartData(receipts: Receipt[], token: Token): ChartData[] {
  let value = 0;
  const result: ChartData[] = [];

  if (!receipts || !token) {
    return result;
  }

  receipts
    .sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1;

      if (a.timestamp < b.timestamp) return -1;

      return 0;
    })
    .forEach((item: Receipt) => {
      const income = item.type === 'Deposit';
      let balance;

      const deposit = Number(formatYoktoValue(item.deposit, token.decimals));

      if (income) {
        balance = value + deposit;
      } else {
        balance = value - deposit;
      }

      value = balance;

      result.push({
        balance,
        timestamp: item.timestamp,
      });
    });

  return result;
}

export function useTokensTransactions(
  daoId: string,
  tokens: Record<string, Token>
): {
  loading: boolean;
  data: Record<string, Receipt[]>;
} {
  const [loading, setLoading] = useState(true);
  const [receiptsByToken, setReceiptsByToken] = useState({});

  useEffect(() => {
    async function getReceiptsData() {
      const daoFtTokens = Object.values(tokens)
        .filter(item => item.symbol !== 'NEAR')
        .map(item => item.tokenId);

      // Fetch FT tokens transactions data
      const ftReceipts = await Promise.all(
        daoFtTokens.map(tokenId =>
          SputnikHttpService.getAccountReceiptsByTokens(daoId, tokenId)
        )
      );

      const ftReceiptsData = ftReceipts.reduce((res, item) => {
        res[item.tokenId] = item.data;

        return res;
      }, {} as Record<string, Receipt[]>);

      // Fetch NEAR transactions data
      const receipts = await SputnikHttpService.getAccountReceipts(daoId);

      // Merge transactions data together
      const result = Object.keys(tokens).reduce<Record<string, Receipt[]>>(
        (res, key) => {
          if (key === 'NEAR') {
            res[key] = receipts[key] ?? [];
          } else {
            res[key] = ftReceiptsData[key] ?? [];
          }

          return res;
        },
        {}
      );

      setReceiptsByToken(result);
      setLoading(false);
    }

    getReceiptsData();
  }, [daoId, tokens]);

  return { data: receiptsByToken, loading };
}

export function useTokenFilteredData(
  receipts: Record<string, Receipt[]>,
  tokens: Record<string, Token>
): {
  chartData: ChartData[];
  transactionsData: Receipt[];
  onFilterChange: (val: string) => void;
  viewToken: string;
} {
  const [viewToken, setViewToken] = useState('NEAR');

  const transactionsData = receipts[viewToken] ?? [];
  const chartData = getChartData(transactionsData, tokens[viewToken]);

  const onFilterChange = useCallback(val => {
    setViewToken(val);
  }, []);

  return {
    chartData,
    transactionsData,
    onFilterChange,
    viewToken,
  };
}
