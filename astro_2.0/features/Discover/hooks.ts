import { PaginationResponse } from 'types/api';
import { useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { DaoFeedItem } from 'types/dao';

export function useDaoSearch(): {
  handleSearch: (
    val: string
  ) => Promise<PaginationResponse<DaoFeedItem[]> | null>;
  loading: boolean;
} {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading }, handleSearch] = useAsyncFn(async query => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current?.cancel('Cancelled by new req');
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    cancelTokenRef.current = source;

    return SputnikHttpService.findDaoByName({
      query,
      cancelToken: source.token,
    });
  }, []);

  return {
    handleSearch,
    loading,
  };
}
