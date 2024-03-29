import React, {
  FC,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
  KeyboardEventHandler,
  ChangeEvent,
} from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useTranslation } from 'next-i18next';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { usePopper } from 'react-popper';
import {
  useClickAway,
  useMedia,
  useMount,
  useMountedState,
  useToggle,
} from 'react-use';
import { SEARCH_PAGE_URL } from 'constants/routing';

import { useSearchResults } from 'features/search/search-results';
import { useOnRouterChange } from 'hooks/useOnRouterChange';
import { IconButton } from 'components/button/IconButton';
import { DropdownResults } from 'astro_2.0/components/AppHeader/components/SearchBar/components/DropdownResults';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { SearchHints } from 'astro_2.0/components/AppHeader/components/SearchBar/components/SearchHints';

import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  withSideBar: boolean;
  className?: string;
  placeholder?: string;
  parentElRef?: MutableRefObject<HTMLElement | null>;
}

export const SearchBar: FC<SearchBarProps> = ({ className, placeholder }) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const POPUP_LEFT_MARGIN = 20;
  const POPUP_RIGHT_MARGIN = 20;
  const { useOpenSearch } = useFlags();
  const isSearchPage = router.pathname.includes(SEARCH_PAGE_URL);
  const isMobile = useMedia('(max-width: 920px)');

  const { handleSearch, handleClose, searchResults, loading } =
    useSearchResults();

  const { t } = useTranslation('common');

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [focused, setFocused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [value, setValue] = useState(
    searchResults?.query || (router.query.search as string) || ''
  );
  const [showHint, toggleHint] = useToggle(false);

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

  const onSearchStateToggle = useCallback(
    (state: boolean) => {
      if (isMobile) {
        setExpanded(state);
      }
    },
    [isMobile]
  );

  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      strategy: 'fixed',
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

  useMount(() => {
    setExpanded(!!searchResults?.query);
  });

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
    setFocused(false);
    handleClose();
    setValue('');
    onSearchStateToggle(false);

    if (isSearchPage) {
      router.back();
    }
  }, [handleClose, router, isSearchPage, onSearchStateToggle]);

  const handleSubmit = useCallback(() => {
    const [_index, _field, _input] = value.split(':');
    const index = _index?.trim();
    const field = _field?.trim();
    const input = _input?.trim();

    if (index && field && input) {
      handleSearch(input, 3, field, index);
    } else if (index && field) {
      handleSearch(field, 3, undefined, index);
    } else if (index) {
      handleSearch(index, 3);
    }
  }, [handleSearch, value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!focused) {
        setFocused(true);
      }

      setValue(e.target.value);
    },
    [focused]
  );

  const handleKeys: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape' && value.trim().length) {
      setValue('');
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const query = value?.trim() ?? '';

      if (query.length >= 3 && query[query.length - 1] !== ':') {
        if (showHint) {
          toggleHint(false);
        }

        handleSubmit();
      } else if (query.length >= 1 && query.length < 3 && focused) {
        toggleHint(true);
      } else {
        toggleHint(false);
        handleClose();
      }
    },
    750,
    [value, handleClose, focused, showHint]
  );

  const openSearch = useCallback(() => {
    onSearchStateToggle(true);
    inputRef?.current?.focus();
  }, [onSearchStateToggle]);

  function getDropdownWidth() {
    const searchMaxWidth = parseInt(styles.searchMaxWidth, 10);

    if (!document?.body) {
      return 0;
    }

    return document?.body?.offsetWidth <
      searchMaxWidth + POPUP_LEFT_MARGIN + POPUP_RIGHT_MARGIN
      ? document.body.offsetWidth - (POPUP_LEFT_MARGIN + POPUP_RIGHT_MARGIN)
      : searchMaxWidth;
  }

  function renderResultsDropdown() {
    const showResults =
      !!searchResults && focused && !isSearchPage && !showHint;

    if (typeof document === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <AnimatePresence>
        {(showHint || showResults || focused) && (
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
                  <span className={styles.hintText}>
                    {t('header.search.minimalChars')}
                  </span>
                </div>
              )}
              {useOpenSearch && (
                <SearchHints
                  value={value}
                  visible={focused}
                  onSelect={(newValue: string) => {
                    setValue(newValue);
                    inputRef?.current?.focus();
                  }}
                />
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
    if (isMounted() && (!isEmpty(value) || isMobile)) {
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

  function renderInput() {
    return (
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
    );
  }

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(-64px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(-64px)' }}
              onAnimationComplete={() => {
                inputRef.current?.focus();
              }}
              className={cn(styles.inputWrapper, {
                [styles.expanded]: expanded,
              })}
            >
              <>
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
                      />
                    )}
                  </AnimatePresence>
                </div>

                {renderInput()}
                {renderCloseButton()}
                <div
                  className={styles.anchor}
                  ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
                />
                {renderResultsDropdown()}
              </>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.iconHolder}>
          <IconButton
            size="medium"
            icon="buttonSearch"
            className={styles.icon}
            onClick={openSearch}
          />
        </div>
      </>
    );
  }

  return (
    <div className={cn(styles.root, className)} ref={ref}>
      <>
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

        {renderInput()}
        {renderCloseButton()}
        <div
          className={styles.anchor}
          ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
        />
        {renderResultsDropdown()}
      </>
    </div>
  );
};
