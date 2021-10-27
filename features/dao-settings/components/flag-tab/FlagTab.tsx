import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  CropReturnType,
  SelectFlag,
} from 'features/create-dao/components/select-flag/SelectFlag';
import {
  LinksFormData,
  schema,
} from 'features/dao-settings/components/links-tab';
import { ProposalBanner } from 'features/dao-settings/components/proposal-banner';
import React, { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useToggle } from 'react-use';
import awsUploader from 'services/AwsUploader/AwsUploader';
import { useSWRConfig } from 'swr';

import { DaoConfig } from 'types/proposal';
import {
  DaoMetadata,
  fromMetadataToBase64,
} from 'services/sputnik/mappers/dao';
import { SputnikNearService } from 'services/sputnik';
import {
  navigateToDaoPage,
  getChangeConfigProposal,
} from 'features/dao-settings/helpers';
import { EditButton } from 'features/dao-settings/components/edit-button/EditButton';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import styles from './flag-tab.module.scss';

interface FlagTabProps {
  daoId: string;
  name: string;
  purpose: string;
  currentDaoMetadata: DaoMetadata;
  proposalBond: string;
}

const sources = [
  '/flags/flag-1.svg',
  '/flags/flag-2.svg',
  '/flags/flag-3.svg',
  '/flags/flag-4.svg',
  '/flags/flag-5.svg',
  '/flags/flag-6.svg',
];

const FlagTab: FC<FlagTabProps> = ({
  daoId,
  name,
  purpose,
  currentDaoMetadata,
  proposalBond,
}) => {
  const router = useRouter();
  const daoFlag = currentDaoMetadata.flag;

  const { mutate } = useSWRConfig();
  const [viewMode, setViewMode] = useToggle(true);

  const methods = useForm<LinksFormData>({
    mode: 'onChange',
    defaultValues: {
      details: '',
      externalUrl: '',
    },
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: CropReturnType) {
    const { Key: fileName } = await awsUploader.uploadToBucket(data.file);
    const newDaoConfig: DaoConfig = {
      name,
      purpose,
      metadata: fromMetadataToBase64({
        links: currentDaoMetadata.links,
        flag: fileName,
        displayName: currentDaoMetadata.displayName,
      }),
    };

    await SputnikNearService.createProposal(
      getChangeConfigProposal(
        daoId,
        newDaoConfig,
        'Changing flag',
        proposalBond
      )
    );
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
      lifetime: 20000,
    });
    await mutate('/daos');
    setViewMode(true);

    navigateToDaoPage(router);
  }

  const fileName = daoId;

  if (!fileName) throw Error('Cannot upload flag. Unknown dao ID');

  return (
    <>
      <FormProvider {...methods}>
        {!viewMode && (
          <ProposalBanner
            scope="config"
            title="Flag"
            form="flag"
            onEdit={setViewMode}
            viewMode={viewMode}
            onCancel={setViewMode}
          />
        )}
      </FormProvider>
      <div className={styles.root}>
        {viewMode ? (
          <div className={styles.preview}>
            <div className={styles.subtitle}>
              Your DAO flag
              {viewMode && <EditButton onClick={setViewMode} />}
            </div>
            <div className="images-container">
              {daoFlag && (
                // eslint-disable-next-line
                <img
                  loading="eager"
                  alt="Result"
                  width={256}
                  height={256}
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
                title="Move the window around to pick your new flag."
                fileName={fileName}
                sources={sources}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FlagTab;
