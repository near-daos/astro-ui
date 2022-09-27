import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAsyncFn } from 'react-use';
import axios, { CancelTokenSource } from 'axios';

import { SputnikHttpService } from 'services/sputnik';
import { SearchService } from 'services/SearchService';

import { SearchResultsData } from 'types/search';

import { useWalletContext } from 'context/WalletContext';

interface SearchResultsContextProps {
  searchResults: SearchResultsData | null;
  handleSearch: (
    query: string,
    size?: number,
    field?: string,
    index?: string
  ) => void;
  handleClose: () => void;
  setSearchResults: (res: null) => void;
  loading: boolean;
  searchServiceInstance: SearchService | typeof SputnikHttpService;
}

const SearchResultsContext = createContext<SearchResultsContextProps>({
  searchResults: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSearch: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearchResults: () => {},
  loading: false,
  searchServiceInstance: SputnikHttpService,
});

export const useSearchResults = (): SearchResultsContextProps =>
  useContext(SearchResultsContext);

export const SearchResults: FC = ({ children }) => {
  const { accountId } = useWalletContext();
  const [searchResults, setSearchResults] = useState<null | SearchResultsData>(
    null
  );
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const { useOpenSearch } = useFlags();

  const searchServiceInstance = useMemo(() => {
    if (useOpenSearch) {
      return new SearchService();
    }

    return SputnikHttpService;
  }, [useOpenSearch]);

  const [{ loading }, handleSearch] = useAsyncFn(
    async (query, size, field, index) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current?.cancel('Cancelled by new req');
      }

      const { CancelToken } = axios;
      const source = CancelToken.source();

      cancelTokenRef.current = source;

      const res = await searchServiceInstance.search({
        query,
        cancelToken: source.token,
        accountId: accountId ?? '',
        size,
        field,
        index,
      });

      setSearchResults(res);
    },
    [searchServiceInstance]
  );

  const handleClose = useCallback(() => {
    setSearchResults(null);
  }, []);

  return (
    <SearchResultsContext.Provider
      value={{
        searchResults,
        handleSearch,
        handleClose,
        setSearchResults,
        loading,
        searchServiceInstance,
      }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
};
