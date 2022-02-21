import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';

import { SearchResultsData } from 'types/search';
import { useAuthContext } from 'context/AuthContext';
import { useSearch } from 'hooks/api/useSearch';

interface SearchResultsContextProps {
  searchResults: SearchResultsData | null;
  handleSearch: (query: string) => void;
  handleClose: () => void;
  loading: boolean;
}

const SearchResultsContext = createContext<SearchResultsContextProps>({
  searchResults: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSearch: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClose: () => {},
  loading: false,
});

export const useSearchResults = (): SearchResultsContextProps =>
  useContext(SearchResultsContext);

export const SearchResults: FC = ({ children }) => {
  const { accountId } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');

  const { mappedData, isValidating, cancelToken } = useSearch({
    query: searchQuery,
    accountId: accountId ?? '',
  });

  const handleSearch = useCallback(
    (query: string) => {
      cancelToken.current?.cancel();

      setSearchQuery(query);
    },
    [cancelToken]
  );

  const handleClose = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <SearchResultsContext.Provider
      value={{
        searchResults: mappedData,
        handleSearch,
        handleClose,
        loading: isValidating,
      }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
};
