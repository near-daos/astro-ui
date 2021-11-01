import React, {
  FC,
  useRef,
  useState,
  useCallback,
  KeyboardEventHandler,
} from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/router';
import { usePopper } from 'react-popper';
import { useClickAway, useDebounce } from 'react-use';

import { SEARCH_PAGE_URL } from 'constants/routing';

import { useSearchResults } from 'features/search/search-results';
import { DropdownResults } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults';

import { IconButton } from 'components/button/IconButton';

import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({ placeholder }) => {
  const router = useRouter();
  const ref = useRef(null);

  const isSearchPage = router.pathname.includes(SEARCH_PAGE_URL);

  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 23],
          },
        },
      ],
    }
  );

  const [value, setValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSearch,
    handleClose,
    searchResults,
    setSearchResults,
  } = useSearchResults();

  useDebounce(
    () => {
      const query = value?.trim() ?? '';

      if (expanded && query.length > 0) {
        handleSearch(query);
      } else if (expanded) {
        setSearchResults(null);
      }
    },
    500,
    [value]
  );

  useClickAway(ref, e => {
    if (!searchResults) {
      setExpanded(false);
    }

    const searchResElement = (e.target as HTMLElement).closest(
      '#astro_search-results'
    );

    if (!searchResElement) {
      setFocused(false);
    }
  });

  const handleCancel = useCallback(() => {
    handleClose();
    setValue('');
    setExpanded(false);
  }, [handleClose]);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      router.push(SEARCH_PAGE_URL);
    } else {
      handleCancel();
    }
  }, [handleCancel, router, value]);

  const handleChange = useCallback(e => {
    const newValue = e.target.value;

    setValue(newValue);
  }, []);

  const handleKeys: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape' && value.trim().length) {
      setValue('');
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const openSearch = useCallback(() => {
    setExpanded(true);
    inputRef?.current?.focus();
  }, []);

  function getDropdownWidth() {
    return document?.body?.offsetWidth < 768
      ? document?.body?.offsetWidth
      : 768;
  }

  function renderResultsDropdown() {
    if (!!searchResults && expanded && focused && !isSearchPage) {
      return ReactDOM.createPortal(
        <div
          id="astro_search-results"
          ref={setPopperElement as React.LegacyRef<HTMLDivElement>}
          style={{ ...popperStyles.popper, zIndex: 100 }}
          {...attributes.popper}
        >
          <DropdownResults
            width={getDropdownWidth()}
            closeSearch={handleCancel}
          />
        </div>,
        document.body
      );
    }

    return null;
  }

  return (
    <div className={cn(styles.root, { [styles.expanded]: expanded })} ref={ref}>
      <div className={styles.iconHolder}>
        <IconButton
          size="medium"
          icon="buttonSearch"
          className={styles.icon}
          onClick={openSearch}
        />
      </div>

      <input
        ref={inputRef}
        tabIndex={0}
        value={value}
        onFocus={() => setFocused(true)}
        onChange={handleChange}
        className={cn(styles.input, 'body1')}
        type="text"
        placeholder={placeholder}
        onKeyUp={handleKeys}
      />

      <div className={styles.closeIconHolder}>
        <IconButton
          size="medium"
          icon="closeCircle"
          className={styles.icon}
          onClick={handleCancel}
        />
      </div>
      <div
        className={styles.anchor}
        ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
      />
      {renderResultsDropdown()}
    </div>
  );
};
