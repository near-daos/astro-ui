import React, { FC } from 'react';
import { Button } from 'components/button/Button';
import { SelectFlag } from 'features/create-dao/components/select-flag/SelectFlag';

import styles from './flag-tab.module.scss';

interface FlagTabProps {
  onChange: (name: string, value: string) => void;
  viewMode: boolean;
  daoFlag?: string;
}

const sources = ['/flags/flag-1.svg'];

const FlagTab: FC<FlagTabProps> = ({ viewMode, daoFlag, onChange }) => {
  return (
    <div className={styles.root}>
      {viewMode ? (
        <div className={styles.preview}>
          <div>
            {daoFlag
              ? 'Your DAO flag. It looks great!'
              : 'You have no DAO flag yet. Time to create one!'}
          </div>
          <div className="images-container">
            {daoFlag && (
              // eslint-disable-next-line
              <img alt="Result" width={300} height={300} src={daoFlag} />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.edit}>
          <div className={styles.cropper}>
            <SelectFlag
              id="flag"
              sources={sources}
              onSubmit={data => onChange('daoFlag', data)}
            />
          </div>
          <div className={styles.btn}>
            <Button type="submit" form="flag" size="small">
              Crop!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlagTab;
