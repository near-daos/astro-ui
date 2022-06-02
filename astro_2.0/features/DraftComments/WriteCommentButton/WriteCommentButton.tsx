import React, { FC } from 'react';

import styles from './WriteCommentButton.module.scss';

type WriteCommentButtonProps = {
  handleClick: () => void;
};

export const WriteCommentButton: FC<WriteCommentButtonProps> = ({
  handleClick,
}) => {
  return (
    <button
      className={styles.writeCommentButton}
      type="button"
      onClick={handleClick}
    >
      Write a comment...
    </button>
  );
};
