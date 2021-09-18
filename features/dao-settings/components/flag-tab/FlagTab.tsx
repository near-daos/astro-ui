import { useSelectedDAO } from 'hooks/useSelectedDao';
import React, { FC } from 'react';
import { Button } from 'components/button/Button';
import {
  CropReturnType,
  SelectFlag
} from 'features/create-dao/components/select-flag/SelectFlag';
import awsUploader from 'services/AwsUploader/AwsUploader';
import Image from 'next/image';
import { useSWRConfig } from 'swr';

import styles from './flag-tab.module.scss';

interface FlagTabProps {
  onChange: (name: string, value: string) => void;
  viewMode: boolean;
  daoFlag?: string;
}

const sources = [
  '/flags/flag-1.svg',
  '/flags/flag-2.svg',
  '/flags/flag-3.svg',
  '/flags/flag-4.svg',
  '/flags/flag-5.svg',
  '/flags/flag-6.svg'
];

const FlagTab: FC<FlagTabProps> = ({ viewMode, daoFlag }) => {
  const dao = useSelectedDAO();
  const { mutate } = useSWRConfig();

  async function onSubmit(data: CropReturnType) {
    await awsUploader.uploadToBucket(data.file);

    await mutate('/daos');
  }

  const fileName = dao?.id;

  if (!fileName) throw Error('Cannot upload flag. Unknown dao ID');

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
              <Image
                loading="eager"
                alt="Result"
                width={300}
                height={300}
                src={daoFlag}
              />
            )}
          </div>
        </div>
      ) : (
        <div className={styles.edit}>
          <div className={styles.cropper}>
            <SelectFlag
              id="flag"
              fileName={fileName}
              sources={sources}
              onSubmit={onSubmit}
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
