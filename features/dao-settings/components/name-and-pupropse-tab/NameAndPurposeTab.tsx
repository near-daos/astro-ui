import * as yup from 'yup';
import cn from 'classnames';
import last from 'lodash/last';
import { useToggle } from 'react-use';
import { useRouter } from 'next/router';
import React, { useCallback, VFC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

import { DaoConfig } from 'types/proposal';

import { SputnikWalletError } from 'errors/SputnikWalletError';
import { Input } from 'components/inputs/input/Input';
import { TextArea } from 'components/inputs/textarea/TextArea';
import {
  navigateToDaoPage,
  NameAndPurposeData,
  getChangeConfigProposal,
} from 'features/dao-settings/helpers';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { ProposalBanner } from 'features/dao-settings/components/proposal-banner';
import { EditButton } from 'features/dao-settings/components/edit-button/EditButton';

import {
  DaoMetadata,
  fromMetadataToBase64,
} from 'services/sputnik/mappers/dao';
import { SputnikNearService } from 'services/sputnik';

import styles from './name-and-purpose-tab.module.scss';

export const schema = yup.object().shape({
  displayName: yup.string().min(2).required(),
  purpose: yup.string().max(500),
});

export interface NameAndPurposeTabProps {
  daoId: string;
  name: string;
  purpose: string;
  currentDaoMetadata: DaoMetadata;
  proposalBond: string;
}

export const NameAndPurposeTab: VFC<NameAndPurposeTabProps> = ({
  daoId,
  name,
  purpose,
  currentDaoMetadata,
  proposalBond,
}) => {
  const router = useRouter();

  const [viewMode, setViewMode] = useToggle(true);
  const [isSubmitting, setSubmitting] = useToggle(false);

  const getDisplayName = useCallback(() => {
    return currentDaoMetadata.displayName || name;
  }, [name, currentDaoMetadata.displayName]);

  const methods = useForm<NameAndPurposeData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      purpose,
      displayName: getDisplayName(),
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, touchedFields, isDirty, isValid },
  } = methods;

  const onSubmit = useCallback(
    async (data: NameAndPurposeData) => {
      try {
        setSubmitting(true);

        const { links, flag } = currentDaoMetadata;

        const url = flag?.split('/');
        const fileName = last(url);

        const newDaoConfig: DaoConfig = {
          name,
          purpose: data.purpose,
          metadata: fromMetadataToBase64({
            links,
            flag: fileName,
            displayName: data.displayName,
          }),
        };

        await SputnikNearService.createProposal(
          getChangeConfigProposal(
            daoId,
            newDaoConfig,
            'Changing name/purpose',
            proposalBond
          )
        );
        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000,
        });
        setSubmitting(false);
        setViewMode(true);

        navigateToDaoPage(router);
      } catch (error) {
        console.warn(error);

        if (error instanceof SputnikWalletError) {
          showNotification({
            type: NOTIFICATION_TYPES.ERROR,
            description: error.message,
            lifetime: 20000,
          });
        }
      }
    },
    [
      name,
      router,
      setSubmitting,
      currentDaoMetadata,
      daoId,
      proposalBond,
      setViewMode,
    ]
  );

  const onCancel = useCallback(() => {
    setViewMode(true);
    reset({
      purpose,
      displayName: getDisplayName(),
    });
  }, [purpose, reset, setViewMode, getDisplayName]);

  function getDisableTooltip() {
    if (!isDirty) return 'You need to make changes to submit proposal';

    if (!isValid) return 'Some fields are invalid';

    return undefined;
  }

  return (
    <>
      <div className={cn(styles.row, styles.panel)}>
        <div className={styles.label}>Account name (cannot be changed)</div>
        <p>{daoId}</p>
      </div>

      <div className={styles.separator} />

      <FormProvider {...methods}>
        {!viewMode && (
          <ProposalBanner
            scope="config"
            title="Name & Purpose"
            form="settings"
            disable={!isValid || !isDirty || isSubmitting}
            disableTooltip={getDisableTooltip()}
            onEdit={setViewMode}
            viewMode={viewMode}
            onCancel={onCancel}
          />
        )}
      </FormProvider>

      <form
        id="settings"
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <div className={cn(styles.row, styles.inline)}>
          <div>
            <div className={styles.label}>Name</div>
            {viewMode ? (
              <span>{getDisplayName()}</span>
            ) : (
              <Input
                {...register('displayName')}
                isValid={
                  touchedFields.displayName && !errors.displayName?.message
                }
                size="block"
                maxLength={500}
                textAlign="left"
              />
            )}
          </div>
          {viewMode && <EditButton onClick={setViewMode} />}
        </div>

        <div className={styles.row}>
          <div>
            <div className={styles.label}>Purpose</div>
            {viewMode ? (
              <span className={styles.purpose}>{purpose}</span>
            ) : (
              <TextArea
                {...register('purpose')}
                size="block"
                textAlign="left"
                resize="none"
                maxLength={500}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
