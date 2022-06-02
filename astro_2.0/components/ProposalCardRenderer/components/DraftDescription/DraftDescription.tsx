/* eslint-disable react/no-danger */
import React, { FC } from 'react';
import cn from 'classnames';

import styles from './DraftDescription.module.scss';

interface DraftDescriptionProps {
  className?: string;
  description: string;
}

export const DraftDescription: FC<DraftDescriptionProps> = ({
  className,
  description,
}) => {
  return (
    <div
      className={cn(styles.draftDescription, className)}
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
};
