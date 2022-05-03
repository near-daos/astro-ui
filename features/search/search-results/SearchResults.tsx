import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { SputnikHttpService } from 'services/sputnik';

import { SearchResultsData } from 'types/search';
import { useAsyncFn } from 'react-use';
import axios, { CancelTokenSource } from 'axios';
import { useWalletContext } from 'context/WalletContext';

interface SearchResultsContextProps {
  searchResults: SearchResultsData | null;
  handleSearch: (query: string) => void;
  handleClose: () => void;
  setSearchResults: (res: null) => void;
  loading: boolean;
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
});

export const useSearchResults = (): SearchResultsContextProps =>
  useContext(SearchResultsContext);

export const SearchResults: FC = ({ children }) => {
  const { accountId } = useWalletContext();
  const [searchResults, setSearchResults] = useState<null | SearchResultsData>(
    null
  );
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading }, handleSearch] = useAsyncFn(async query => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current?.cancel('Cancelled by new req');
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    cancelTokenRef.current = source;

    const res = await SputnikHttpService.search({
      query,
      cancelToken: source.token,
      accountId: accountId ?? '',
    });

    setSearchResults(res);
  }, []);

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
      }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
};
