import React, {
  FC,
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { usePopper } from 'react-popper';
import { useDebounce, useMountedState, useToggle } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';
import isEmpty from 'lodash/isEmpty';

import { IconButton } from 'components/button/IconButton';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Icon } from 'components/Icon';

import { DaoFeedItem } from 'types/dao';
import { PaginationResponse } from 'types/api';

import styles from './SearchInput.module.scss';

const POPUP_LEFT_MARGIN = 20;
const POPUP_RIGHT_MARGIN = 20;

interface SearchInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (val: string) => Promise<PaginationResponse<any> | null>;
  className?: string;
  loading: boolean;
  onClose?: () => void;
  placeholder?: string;
  showResults?: boolean;
  renderResult?: (item: DaoFeedItem) => ReactNode;
}

export const SearchInput: FC<SearchInputProps> = ({
  onSubmit,
  className,
  loading,
  onClose,
  placeholder,
  showResults,
  renderResult,
}) => {
  const isMounted = useMountedState();
  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');
  const [showHint, toggleShowHint] = useToggle(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<unknown[] | null>(null);

  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 12],
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

  const handleCancel = useCallback(() => {
    setValue('');
    setSearchResults(null);

    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (value.trim()) {
      const res = await onSubmit(value.trim());

      if (showResults && res) {
        setSearchResults(res.data);
      }
    } else {
      handleCancel();
    }
  }, [handleCancel, onSubmit, showResults, value]);

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

  useDebounce(
    async () => {
      const query = value?.trim() ?? '';

      if (query.length >= 3) {
        toggleShowHint(false);

        const res = await onSubmit(query);

        if (showResults && res) {
          setSearchResults(res.data);
        }
      } else if (query.length > 0 && query.length < 3) {
        setSearchResults(null);
        toggleShowHint(true);
      } else {
        setSearchResults(null);
        toggleShowHint(false);

        if (onClose) {
          onClose();
        }
      }
    },
    750,
    [value]
  );

  function renderResultsDropdown() {
    if (typeof document === 'undefined') {
      return null;
    }

    return ReactDOM.createPortal(
      <AnimatePresence>
        {(showHint || searchResults) && (
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
                  Please enter at least 3 characters to search
                </div>
              )}
              {showResults && !!searchResults?.length && renderResult && (
                <div className={styles.hint}>
                  {searchResults.map(item => {
                    const data = item as DaoFeedItem;

                    return renderResult(data);
                  })}
                </div>
              )}
              {showResults && !searchResults?.length && (
                <div className={styles.hint}>
                  <NoResultsView
                    title="No results found"
                    imgClassName={styles.noResultsImage}
                    className={styles.noResults}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  function renderCloseButton() {
    if (isMounted() && !isEmpty(value)) {
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
    <div className={cn(styles.root, className)} ref={ref}>
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
            <Icon name="buttonSearch" className={styles.icon} />
          )}
        </AnimatePresence>
      </div>
      <input
        ref={inputRef}
        tabIndex={0}
        value={value}
        onChange={handleChange}
        className={cn(styles.input, 'body1')}
        type="text"
        placeholder={placeholder || 'Search Bounty Name'}
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
