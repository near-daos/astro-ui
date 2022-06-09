import React, { ChangeEvent, FC } from 'react';

import styles from './EditTitle.module.scss';

type EditTitleProps = {
  title?: string;
  setTitle: (value: string) => void;
  placeholder?: string;
};

export const EditTitle: FC<EditTitleProps> = ({
  title,
  setTitle,
  placeholder = 'Title',
}) => {
  return (
    <div className={styles.editTitle}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setTitle(event.target.value)
        }
        placeholder={placeholder}
      />
    </div>
  );
};
