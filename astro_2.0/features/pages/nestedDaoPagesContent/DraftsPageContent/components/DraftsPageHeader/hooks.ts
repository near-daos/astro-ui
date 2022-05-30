import { PaginationResponse } from 'types/api';
// import { useRouter } from 'next/router';
// import { useWalletContext } from 'context/WalletContext';
import { useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useAsyncFn } from 'react-use';
// import { SputnikHttpService } from 'services/sputnik';

export function useDraftsSearch(): {
  handleSearch: (val: string) => Promise<PaginationResponse<unknown[]> | null>;
  loading: boolean;
  value: PaginationResponse<unknown[]> | undefined;
} {
  // const router = useRouter();
  // const daoId = router.query.dao as string;
  // const { accountId } = useWalletContext();
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
