import { useRef } from 'react';
import { useAsyncFn } from 'react-use';
import axios, { CancelTokenSource } from 'axios';

import { PaginationResponse } from 'types/api';

export function useDraftsSearch(): {
  handleSearch: (val: string) => Promise<PaginationResponse<unknown[]> | null>;
  loading: boolean;
  value: PaginationResponse<unknown[]> | undefined;
} {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading, value }, handleSearch] = useAsyncFn(async () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current?.cancel('Cancelled by new req');
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    cancelTokenRef.current = source;

    return Promise.resolve({
      count: 0,
      total: 0,
      page: 1,
      pageCount: 0,
      data: [] as unknown[],
    });
  }, []);

  return {
    handleSearch,
    loading,
    value,
  };
}
