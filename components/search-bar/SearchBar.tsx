import React, {
  FC,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState
} from 'react';
import cn from 'classnames';
import { useClickAway, useDebounce } from 'react-use';
import { usePopper } from 'react-popper';
import { useRouter } from 'next/router';
import ReactDOM from 'react-dom';

import { useSearchResults } from 'features/search/search-results';
import { DropdownResults } from 'features/search/search-results/components/dropdown-results';

import { IconButton } from 'components/button/IconButton';

import styles from './search-bar.module.scss';

export interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder }) => {
  const router = useRouter();
  const ref = useRef(null);

  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement
  );

  const [value, setValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSearch,
    handleClose,
    searchResults,
    setSearchResults
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
      router.push('/search-results');
    } else {
      handleCancel();
    }
  }, [handleCancel, router, value]);

  const handleChange = useCallback(e => {
    const newValue = e.target.value;

    setValue(newValue);
    // handleSearch(newValue);
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

  const handleSearchClick = useCallback(() => {
    setExpanded(true);
    inputRef?.current?.focus();
  }, []);

  return (
    <div className={cn(styles.root, { [styles.expanded]: expanded })} ref={ref}>
      <div className={styles.inputIcon}>
        <IconButton
          icon="buttonSearch"
          onClick={handleSearchClick}
          size="medium"
        />
      </div>

      <input
        ref={inputRef}
        tabIndex={0}
        value={value}
        onFocus={() => setFocused(true)}
        // onBlur={() => setFocused(false)}
        onChange={handleChange}
        className={cn(styles.input, 'body1')}
        type="text"
        placeholder={placeholder}
        onKeyUp={handleKeys}
      />

      <div className={styles.submitIcon}>
        <IconButton
          icon="buttonArrowRight"
          size="medium"
          onClick={handleSubmit}
        />
      </div>
      <div
        className={styles.anchor}
        ref={setReferenceElement as React.LegacyRef<HTMLDivElement>}
      />
      {!!searchResults &&
        expanded &&
        focused &&
        !router.pathname.includes('search-results') &&
        ReactDOM.createPortal(
          <div
            id="astro_search-results"
            ref={setPopperElement as React.LegacyRef<HTMLDivElement>}
            style={{ ...popperStyles.popper, zIndex: 100 }}
            {...attributes.popper}
          >
            <DropdownResults
              onDaoClick={id => {
                router.push(`/dao/${id}`);
                handleCancel();
              }}
              onProposalClick={() => router.push('/search-results?tab=1')}
              onMemberClick={() => router.push('/search-results?tab=2')}
              width={inputRef.current?.getBoundingClientRect().width ?? 0}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default SearchBar;
