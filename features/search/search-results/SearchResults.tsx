import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState
} from 'react';

import { SputnikService } from 'services/SputnikService';

import { SearchResultsData } from 'types/search';

interface SearchResultsContextProps {
  searchResults: SearchResultsData | null;
  handleSearch: (query: string) => void;
  handleClose: () => void;
}

interface InjectedSearchResultsProps {
  searchResults: null | SearchResultsData;
}

interface SearchResultsProps {
  children(props: InjectedSearchResultsProps): JSX.Element;
}

const SearchResultsContext = createContext<SearchResultsContextProps>({
  searchResults: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSearch: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleClose: () => {}
});

export const useSearchResults = (): SearchResultsContextProps =>
  useContext(SearchResultsContext);

export const SearchResults: FC<SearchResultsProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<null | SearchResultsData>(
    null
  );

  const handleSearch = useCallback(query => {
    // fetch data here from service
    SputnikService.search({ query }).then(result => {
      setSearchResults(result);
    });
  }, []);

  const handleClose = useCallback(() => {
    setSearchResults(null);
  }, []);

  return (
    <SearchResultsContext.Provider
      value={{ searchResults, handleSearch, handleClose }}
    >
      {children({ searchResults })}
    </SearchResultsContext.Provider>
  );
};
