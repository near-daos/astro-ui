import React, {
  FC,
  KeyboardEventHandler,
  ReactElement,
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
import { useTranslation } from 'next-i18next';

import { IconButton } from 'components/button/IconButton';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Icon } from 'components/Icon';

import styles from './SearchInput.module.scss';

const POPUP_LEFT_MARGIN = 20;
const POPUP_RIGHT_MARGIN = 20;

const OFFSET_TOP_BOTTOM = 12;
const OFFSET_LEFT_RIGHT = 0;

interface SearchInputProps {
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (val: string) => Promise<any>;
  className?: string;
  resultHintClassName?: string;
  loading: boolean;
  onClose?: () => void;
  placeholder?: string;
  showResults?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderResult?: (item: any) => ReactNode | ReactElement;
  showLoader?: boolean;
  offset?: [number, number];
  inputClassName?: string;
  iconClassName?: string;
  removeButtonClassName?: string;
  removeIconClassName?: string;
  defaultValue?: string;
}

export const SearchInput: FC<SearchInputProps> = ({
  onSubmit,
  className,
  resultHintClassName,
  loading,
  onClose,
  placeholder,
  showResults,
  renderResult,
  showLoader = true,
  offset = [OFFSET_LEFT_RIGHT, OFFSET_TOP_BOTTOM],
  inputClassName,
  iconClassName,
  removeButtonClassName,
  removeIconClassName,
  defaultValue = '',
  label,
}) => {
  const { t } = useTranslation();
  const isMounted = useMountedState();
  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(defaultValue);
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
            offset,
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
        setSearchResults(res);
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
                  {t('minimumSearchCharacters')}
                </div>
              )}
              {showResults && !!searchResults?.length && renderResult && (
                <div
                  className={cn(styles.hint, resultHintClassName)}
                  id="search_results"
                >
                  {searchResults.map(item => {
                    return renderResult(item);
                  })}
                </div>
              )}
              {!showHint && showResults && !searchResults?.length && (
                <div className={styles.hint}>
                  <NoResultsView
                    title={t('noResultsFound')}
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
        <div className={cn(styles.closeIconHolder, removeButtonClassName)}>
          <IconButton
            size="medium"
            icon="closeCircle"
            className={styles.icon}
            onClick={handleCancel}
            iconProps={{ className: removeIconClassName }}
          />
        </div>
      );
    }

    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        tabIndex={0}
        role="button"
        onKeyPress={() => {
          inputRef.current?.focus();
        }}
        className={cn(styles.container)}
        ref={ref}
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {showLoader ? (
          <div className={cn(styles.iconHolder, iconClassName)}>
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingIndicator
                    className={cn(styles.loader, iconClassName)}
                  />
                </motion.div>
              ) : (
                <Icon name="buttonSearch" className={styles.icon} />
              )}
            </AnimatePresence>
          </div>
        ) : null}
        <input
          ref={inputRef}
          tabIndex={0}
          value={value}
          onChange={handleChange}
          className={cn(styles.input, inputClassName, {
            [styles.withoutLoading]: !showLoader,
          })}
          type="text"
          placeholder={placeholder || t('searchBountyPlaceholder')}
          onKeyUp={handleKeys}
        />
        {renderCloseButton()}
        <div
          className={styles.anchor}
          ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
        />
        {renderResultsDropdown()}
      </div>
    </div>
  );
};
