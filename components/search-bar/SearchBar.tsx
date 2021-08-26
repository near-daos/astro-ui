import React, { FC, KeyboardEventHandler, useCallback, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';

import styles from './search-bar.module.scss';

export interface SearchBarProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, onSubmit }) => {
  const [value, setValue] = useState('');

  const handleCancel = useCallback(() => {
    setValue('');
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(value);
    handleCancel();
  }, [handleCancel, onSubmit, value]);

  const handleKeys: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.inputIcon}>
        <Icon name="buttonSearch" width={24} height={24} />
      </div>

      <input
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
