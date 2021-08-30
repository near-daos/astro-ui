import React, {
  FC,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState
} from 'react';
import cn from 'classnames';
import { useClickAway } from 'react-use';

import { IconButton } from 'components/button/IconButton';

import styles from './search-bar.module.scss';

export interface SearchBarProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, onSubmit }) => {
  const [value, setValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useClickAway(ref, () => {
    setExpanded(false);
  });

  const handleCancel = useCallback(() => {
    setValue('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(value);
    }

    handleCancel();
  }, [handleCancel, onSubmit, value]);

  const handleKeys: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      handleSubmit();
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
        onChange={e => setValue(e.target.value)}
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
    </div>
  );
};

export default SearchBar;
