import React, { FC } from 'react';
import cn from 'classnames';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import styles from './ChangeLinks.module.scss';

interface ChangeLinksContentProps {
  daoId: string;
  links: string[];
}

export const ChangeLinksContent: FC<ChangeLinksContentProps> = ({
  daoId,
  links,
}) => {
  return (
    <div className={styles.root}>
      <FieldWrapper label="New DAO links">
        {links.map(link => (
          <FieldValue value={link} key={link} />
        ))}
      </FieldWrapper>

      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
