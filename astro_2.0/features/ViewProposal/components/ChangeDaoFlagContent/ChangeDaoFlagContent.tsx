import React, { FC } from 'react';
import cn from 'classnames';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './ChangeDaoFlagContent.module.scss';

interface ChangeDaoFlagContentProps {
  daoId: string;
  cover?: string;
  logo?: string;
}

export const ChangeDaoFlagContent: FC<ChangeDaoFlagContentProps> = ({
  daoId,
  cover,
  logo,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <FieldWrapper label="Preview" fullWidth>
          {cover && (
            <div className={styles.flag}>
              <div className={styles.background} />
              <div
                className={styles.cover}
                style={{
                  backgroundImage: `url(${cover})`,
                }}
              />
              {logo && (
                <div
                  className={styles.logo}
                  style={{
                    backgroundImage: `url(${logo})`,
                  }}
                />
              )}
            </div>
          )}
        </FieldWrapper>
      </div>
      <div className={cn(styles.row, styles.target)}>
        <InfoBlockWidget label="Target" value={daoId} valueFontSize="S" />
      </div>
    </div>
  );
};
