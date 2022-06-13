import React, { FC, useCallback } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';

import styles from './DuplicateSharedTemplate.module.scss';

interface Props {
  className?: string;
}

export const DuplicateSharedTemplate: FC<Props> = ({ className }) => {
  const handleDuplicateClick = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <Button
      variant="green"
      size="small"
      capitalize
      className={cn(styles.controlBtn, className)}
      onClick={handleDuplicateClick}
    >
      <Icon name="buttonCopy" className={styles.icon} />
      <span>Duplicate</span>
    </Button>
  );
};
