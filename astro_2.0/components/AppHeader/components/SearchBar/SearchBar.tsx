import React, {
  FC,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
  KeyboardEventHandler,
} from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { usePopper } from 'react-popper';
import { useClickAway, useDebounce, useMount } from 'react-use';

import { SEARCH_PAGE_URL } from 'constants/routing';

import { useWindowResize } from 'hooks/useWindowResize';
import { useSearchResults } from 'features/search/search-results';

import { IconButton } from 'components/button/IconButton';
import { DropdownResults } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults';

import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  withSideBar: boolean;
  className?: string;
  placeholder?: string;
  parentElRef: MutableRefObject<HTMLElement | null>;
}

export const SearchBar: FC<SearchBarProps> = ({
  className,
  parentElRef,
  placeholder,
  withSideBar,
}) => {
  const POPUP_LEFT_MARGIN = 20;
  const POPUP_RIGHT_MARGIN = 20;

  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [searchWidth, setSearchWidth] = useState<number | string>(40);

  const router = useRouter();

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function isDesktopResolution() {
    try {
      return document?.body?.offsetWidth > parseInt(styles.navMobileWidth, 10);
    } catch (e) {
      return false;
    }
  }

  useMount(() => {
    setMounted(true);

    // The code is needed to add "search" query param on app initialisation.
    // Otherwise page is reloaded when "search" param is added for the first
    // time. It makes "search results" popup disappear which is not something
    // we want. Update of the query param doesn't cause reload.
    if (!router.query.search) {
      router.push(
        {
          query: {
            ...router.query,
            search: '',
          },
        },
        undefined,
        {
          scroll: false,
          shallow: true,
        }
      );
    }
  });

  const calculateWidth = useCallback(() => {
    if (withSideBar) {
      setSearchWidth(isDesktopResolution() ? 420 : '');
    } else {
      const NEIGHBOURS_WIDTH_AND_PADDINGS = 500;
      const parentEl = parentElRef.current;

      if (parentEl && isDesktopResolution()) {
        const width = parentEl.offsetWidth;
        const possibleWidth = width - NEIGHBOURS_WIDTH_AND_PADDINGS;

        setSearchWidth(possibleWidth);
      } else {
        setSearchWidth('');
      }
    }
  }, [withSideBar, parentElRef]);

  const calculateExpanded = useCallback(() => {
    if (isDesktopResolution() && !expanded) {
      setExpanded(true);
    }
  }, [expanded]);

  const onWindowResize = useCallback(() => {
    calculateWidth();
    calculateExpanded();
  }, [calculateWidth, calculateExpanded]);

  useWindowResize(onWindowResize);

  const isSearchPage = router.pathname.includes(SEARCH_PAGE_URL);

  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 23],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: { left: POPUP_LEFT_MARGIN, right: POPUP_RIGHT_MARGIN },
          },
        },
      ],
    }
  );

  const { handleSearch, handleClose, searchResults } = useSearchResults();

  const [value, setValue] = useState(
    searchResults?.query || (router.query.search as string) || ''
  );

  useMount(() => {
    setExpanded(isDesktopResolution() || !!searchResults?.query);
  });

  const onSearchStateToggle = useCallback(state => {
    if (!isDesktopResolution()) {
      setExpanded(state);
    }
  }, []);

  useDebounce(
    () => {
      const query = value?.trim() ?? '';

      if (expanded && query.length > 0) {
        handleSearch(query);
      } else if (expanded) {
        handleClose();
      }
    },
    500,
    [value, handleClose]
  );

  useClickAway(ref, e => {
    if (!searchResults) {
      onSearchStateToggle(false);
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
    onSearchStateToggle(false);
  }, [handleClose, onSearchStateToggle]);

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
    onSearchStateToggle(true);
    inputRef?.current?.focus();
  }, [onSearchStateToggle]);

  function getDropdownWidth() {
    const searchMaxWidth = parseInt(styles.searchMaxWidth, 10);

    return document?.body?.offsetWidth <
      searchMaxWidth + POPUP_LEFT_MARGIN + POPUP_RIGHT_MARGIN
      ? document?.body?.offsetWidth - (POPUP_LEFT_MARGIN + POPUP_RIGHT_MARGIN)
      : searchMaxWidth;
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

  function renderCloseButton() {
    if (mounted && (!isEmpty(value) || !isDesktopResolution())) {
      return (
        <div className={styles.closeIconHolder}>
          <IconButton
            size="medium"
            icon="closeCircle"
            className={styles.icon}
            onClick={handleCancel}
          />
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className={cn(styles.root, className, { [styles.expanded]: expanded })}
      ref={ref}
      style={{
        maxWidth: searchWidth,
      }}
    >
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
      {renderCloseButton()}
      <div
        className={styles.anchor}
        ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
      />
      {renderResultsDropdown()}
    </div>
  );
};
