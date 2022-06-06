import React, { ChangeEvent, FC } from 'react';

import styles from './EditTitle.module.scss';

type EditTitleProps = {
  title?: string;
  setTitle: (value: string) => void;
};

export const EditTitle: FC<EditTitleProps> = ({ title, setTitle }) => {
  return (
    <div className={styles.editTitle}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setTitle(event.target.value)
        }
        placeholder="Add draft name"
      />
    </div>
  );
};
