/* eslint-disable react/no-danger */
import React, { FC } from 'react';
import cn from 'classnames';
import DOMPurify from 'dompurify';

import styles from './DraftDescription.module.scss';

interface DraftDescriptionProps {
  className?: string;
  description: string;
}

export const DraftDescription: FC<DraftDescriptionProps> = ({
  className,
  description,
}) => {
  const clean = DOMPurify.sanitize(description);

  return (
    <div
      className={cn(styles.draftDescription, className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};
