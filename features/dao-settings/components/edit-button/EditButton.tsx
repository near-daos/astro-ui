import React, { FC } from 'react';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './edit-button.module.scss';

interface EditButtonProps {
  onClick: () => void;
}

export const EditButton: FC<EditButtonProps> = ({ onClick }) => {
  return (
    <Button
      size="small"
      onClick={onClick}
      variant="tertiary"
      className={styles.root}
    >
      <>
        <Icon name="buttonEdit" width={24} />
        Edit
      </>
    </Button>
  );
};
