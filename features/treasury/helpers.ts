import { Receipt } from 'types/transaction';
import { ChartData } from 'types/chart';
import { formatYoktoValue } from 'utils/format';
import { Token } from 'types/token';
import { SputnikHttpService } from 'services/sputnik';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useEffect } from 'react';

export function getChartData(receipts: Receipt[], token: Token): ChartData[] {
  const result: ChartData[] = [];

  if (!receipts || !token) {
    return result;
  }

  const { balance: currentBalance, decimals, id } = token;

  result.push({
    balance: Number(currentBalance),
    timestamp: new Date().getTime(),
    tooltip: 'Now',
  });

  if (id === 'NEAR') {
    let value = 0;

    receipts
      // sort ASC so we will start from today
      .sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return 1;
        }

        if (a.timestamp < b.timestamp) {
          return -1;
        }

        return 0;
      })
      .forEach((item: Receipt) => {
        const income = item.type === 'Deposit';
        let balance;

        const deposit = Number(formatYoktoValue(item.deposit, decimals));

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
  } else {
    let value = Number(currentBalance);

    receipts
      // sort DESC so we will start from today
      .sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }

        if (a.timestamp < b.timestamp) {
          return 1;
        }

        return 0;
      })
      .forEach((item: Receipt, i) => {
        const income = item.type === 'Deposit';
        let balance;

        const deposit = Number(formatYoktoValue(item.deposit, decimals));

        if (i === 0) {
          balance = value;
        } else if (income) {
          balance = value - deposit;
        } else {
          balance = value + deposit;
        }

        value = balance;

        result.push({
          balance,
          timestamp: item.timestamp,
        });
      });
  }

  return result.sort((a, b) => {
    if (a.timestamp > b.timestamp) {
      return 1;
    }

    if (a.timestamp < b.timestamp) {
      return -1;
    }

    return 0;
  });
}

export function useTokenFilteredData(tokens: Record<string, Token>): {
  loading: boolean;
  error: boolean;
  chartData: ChartData[];
  transactionsData: Receipt[];
  onFilterChange: (val: string) => void;
  viewToken: string;
} {
  const { query } = useRouter();
  const daoId = query.dao as string;

  const [{ loading, error, value }, fetchData] = useAsyncFn(
    async viewToken => {
      let data;

      if (viewToken === 'NEAR') {
        data = await SputnikHttpService.getAccountReceipts(daoId);
      } else {
        data = await SputnikHttpService.getAccountReceiptsByTokens(
          daoId,
          viewToken
        );
      }

      if (data) {
        const chartData = getChartData(data, tokens[viewToken]);

        return {
          transactions: data,
          chartData,
          viewToken,
        };
      }

      return {
        transactions: [],
        chartData: [],
        viewToken,
      };
    },
    [tokens]
  );

  useEffect(() => {
    fetchData('NEAR');
  }, [fetchData, tokens]);

  return {
    loading,
    error: !!error,
    chartData: value?.chartData ?? [],
    transactionsData: value?.transactions ?? [],
    onFilterChange: fetchData,
    viewToken: value?.viewToken,
  };
}

export const sorter = (a: Token, b: Token): number => {
  if (b.symbol === 'NEAR') {
    return 1;
  }

  if (a.symbol > b.symbol) {
    return 1;
  }

  if (a.symbol < b.symbol) {
    return -1;
  }

  return 0;
};

export const getAccumulatedTokenValue = (
  tokens: Record<string, Token>
): number => {
  return Object.values(tokens).reduce((res, token) => {
    if (token.price && token.balance) {
      const tokenValue = parseFloat(token.balance) * parseFloat(token.price);

      return res + tokenValue;
    }

    return res;
  }, 0);
};
