import React, { FC, FunctionComponent } from 'react';

import styles from './proposal-button-content.module.scss';

interface ProposalButtonContentProps {
  icon: FunctionComponent;
  title: string;
  description: string;
}

export const ProposalButtonContent: FC<ProposalButtonContentProps> = ({
  icon,
  title,
  description
}) => {
  const I = icon;

  return (
    <>
      <div className={styles.left}>
        <I />
      </div>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </>
  );
};
