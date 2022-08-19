import React, {
  FC,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
  KeyboardEventHandler,
} from 'react';
import { useTranslation } from 'next-i18next';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { usePopper } from 'react-popper';
import { useClickAway, useMount, useMountedState, useToggle } from 'react-use';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { SEARCH_PAGE_URL } from 'constants/routing';

import { useWindowResize } from 'hooks/useWindowResize';

import { useSearchResults } from 'features/search/search-results';
import { useOnRouterChange } from 'hooks/useOnRouterChange';
import { IconButton } from 'components/button/IconButton';
import { DropdownResults } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';

import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  withSideBar: boolean;
  className?: string;
  placeholder?: string;
  parentElRef?: MutableRefObject<HTMLElement | null>;
}

export const SearchBar: FC<SearchBarProps> = ({
  className,
  parentElRef,
  placeholder,
  withSideBar,
}) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const POPUP_LEFT_MARGIN = 20;
  const POPUP_RIGHT_MARGIN = 20;
  const isSearchPage = router.pathname.includes(SEARCH_PAGE_URL);

  const { handleSearch, handleClose, searchResults, loading } =
    useSearchResults();

  const { t } = useTranslation('common');

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchWidth, setSearchWidth] = useState<number | string>(40);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [value, setValue] = useState(
    searchResults?.query || (router.query.search as string) || ''
  );
  const [showHint, toggleShowHint] = useToggle(false);

  const setValueOnRouterChange = () => {
    if (isSearchPage) {
      setValue(
        value || searchResults?.query || (router.query.search as string)
      );
    } else {
      setValue('');
    }
  };

  useOnRouterChange(setValueOnRouterChange);

  function isDesktopResolution() {
    try {
      return document?.body?.offsetWidth > parseInt(styles.navMobileWidth, 10);
    } catch (e) {
      return false;
    }
  }

  const calculateWidth = useCallback(() => {
    if (withSideBar) {
      setSearchWidth(isDesktopResolution() ? 420 : '');
    } else {
      const NEIGHBOURS_WIDTH_AND_PADDINGS = 500;
      const parentEl = parentElRef?.current;

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

  const onSearchStateToggle = useCallback(state => {
    if (!isDesktopResolution()) {
      setExpanded(state);
    }
  }, []);

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

  useWindowResize(onWindowResize);

  useMount(() => {
    setExpanded(isDesktopResolution() || !!searchResults?.query);
  });

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const query = value?.trim() ?? '';

      if (expanded && query.length >= 3) {
        toggleShowHint(false);
        handleSearch(query);
      } else if (expanded && query.length > 0 && query.length < 3) {
        toggleShowHint(true);
      } else if (expanded) {
        toggleShowHint(false);
        handleClose();
      }
    },
    750,
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

    if (isSearchPage) {
      router.back();
    }
  }, [handleClose, router, isSearchPage, onSearchStateToggle]);

  const handleSubmit = useCallback(() => {
    if (isSearchPage) {
      return;
    }

    if (value.trim()) {
      router.push(
        { pathname: SEARCH_PAGE_URL, query: router.query },
        undefined,
        {
          shallow: true,
        }
      );
    } else {
      handleCancel();
    }
  }, [handleCancel, isSearchPage, router, value]);

  const handleChange = useCallback(e => {
    setValue(e.target.value);
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
    const showResults =
      !!searchResults && expanded && focused && !isSearchPage && !showHint;

    if (typeof document === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <AnimatePresence>
        {(showHint || showResults) && (
          <div
            id="astro_search-results"
            ref={setPopperElement}
            style={{ ...popperStyles.popper, zIndex: 100 }}
            {...attributes.popper}
          >
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(40px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0 }}
            >
              {showHint && (
                <div className={styles.hint}>
                  {t('header.search.minimalChars')}
                </div>
              )}
              {showResults && (
                <DropdownResults
                  query={value}
                  width={getDropdownWidth()}
                  closeSearch={handleCancel}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  function renderCloseButton() {
    if (isMounted() && (!isEmpty(value) || !isDesktopResolution())) {
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
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingIndicator className={styles.loader} />
            </motion.div>
          ) : (
            <IconButton
              size="medium"
              icon="buttonSearch"
              className={styles.icon}
              onClick={openSearch}
            />
          )}
        </AnimatePresence>
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
