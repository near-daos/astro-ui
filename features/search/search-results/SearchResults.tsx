import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';

import { SputnikHttpService } from 'services/sputnik';

import { SearchResultsData } from 'types/search';

interface SearchResultsContextProps {
  searchResults: SearchResultsData | null;
  handleSearch: (query: string) => void;
  handleClose: () => void;
  setSearchResults: (res: null) => void;
}

const SearchResultsContext = createContext<SearchResultsContextProps>({
  searchResults: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSearch: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearchResults: () => {},
});

export const useSearchResults = (): SearchResultsContextProps =>
  useContext(SearchResultsContext);

export const SearchResults: FC = ({ children }) => {
  const [searchResults, setSearchResults] = useState<null | SearchResultsData>(
    null
  );

  const handleSearch = useCallback(query => {
    SputnikHttpService.search({ query }).then(result => {
      setSearchResults(result);
    });
  }, []);

  const handleClose = useCallback(() => {
    setSearchResults(null);
  }, []);

  return (
    <SearchResultsContext.Provider
      value={{ searchResults, handleSearch, handleClose, setSearchResults }}
    >
      {children}
    </SearchResultsContext.Provider>
  );
};
