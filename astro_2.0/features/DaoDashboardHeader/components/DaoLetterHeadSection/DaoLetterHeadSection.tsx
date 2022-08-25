import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { MainLayout } from 'astro_3.0/features/MainLayout';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { useAppVersion } from 'hooks/useAppVersion';
import { DAO } from 'types/dao';

import styles from 'astro_2.0/features/DaoDashboardHeader/DaoDashboardHeader.module.scss';
import { DaoSocialLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoSocialLinks';
import { ProposalType, ProposalVariant } from 'types/proposal';
import { Icon } from 'components/Icon';
import { ImageUpload } from 'astro_2.0/features/CreateDao/components/ImageUpload';
import { validateAsset } from 'astro_2.0/features/CreateDao/components/ImageUpload/helpers';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { useFormContext } from 'react-hook-form';
import { getImageFromImageFileList } from 'utils/getImageFromImageFileList';
import { DaoDashboardLogo } from 'astro_3.0/components/DaoDashboardLogo';
import { UserPermissions } from 'types/context';

interface Props {
  dao: DAO;
  onCreateProposal: (
    variant: ProposalVariant,
    initialValues: Record<string, unknown>
  ) => void;
  userPermissions: UserPermissions;
}

export const DaoLetterHeadSection: FC<Props> = ({
  dao,
  onCreateProposal,
  userPermissions,
}) => {
  const { flagCover, flagLogo, daoVersion, links } = dao;
  const { appVersion } = useAppVersion();
  const isNextVersion = appVersion === 3;
  const isEditable =
    userPermissions.allowedProposalsToCreate[ProposalType.ChangeConfig];
  const { watch, setValue } = useFormContext();

  const cover = watch('flagCover');

  const backgroundImageStyles = useMemo(() => {
    if (appVersion === 3) {
      if (cover && cover.length) {
        return {
          backgroundImage: `url(${getImageFromImageFileList(cover)})`,
        };
      }

      return {
        backgroundImage: flagCover ? `url(${flagCover})` : 'none',
      };
    }

    return {
      backgroundImage: `url(${flagCover || '/flags/defaultDaoFlag.png'})`,
    };
  }, [appVersion, cover, flagCover]);

  function renderContent() {
    const content = (
      <div
        className={cn(styles.assetsWrapper, {
          [styles.fitContent]: isNextVersion,
        })}
      >
        <DaoDashboardLogo
          src={flagLogo}
          className={cn(styles.logo, {
            [styles.leftAligned]: isNextVersion,
          })}
          isEditable={
            userPermissions.allowedProposalsToCreate[ProposalType.ChangeConfig]
          }
        />
        {isNextVersion && (
          <DaoSocialLinks
            links={links}
            onCreateProposal={
              userPermissions.allowedProposalsToCreate[
                ProposalType.ChangeConfig
              ]
                ? onCreateProposal
                : undefined
            }
          />
        )}
        {!isNextVersion && daoVersion && (
          <div className={styles.currentDaoVersion}>
            DAO Version:&nbsp;<b>{daoVersion?.version.join('.')}</b>
            <CopyButton
              defaultTooltip="Copy hash"
              text={daoVersion.hash}
              className={styles.copyHash}
              iconClassName={styles.copyIcon}
            />
          </div>
        )}
      </div>
    );

    if (isNextVersion) {
      return <MainLayout className={styles.headerLayout}>{content}</MainLayout>;
    }

    return content;
  }

  const pageContent = (
    <section
      className={cn(styles.letterHeadSection, {
        [styles.fullWidth]: isNextVersion,
        [styles.editable]: isEditable,
      })}
      style={backgroundImageStyles}
    >
      {isNextVersion && isEditable && (
        <div className={styles.editCover}>
          <ImageUpload
            fieldName="flagCover"
            showPreview={false}
            className={styles.uploader}
            onSelect={async value => {
              const res = await validateAsset({ value });

              if (res.errors) {
                showNotification({
                  type: NOTIFICATION_TYPES.ERROR,
                  description: res.errors.value.message
                    ? (res.errors?.value?.message as string)
                    : 'Error uploading image',
                  lifetime: 20000,
                });
                setValue('flagCover', null);
              }
            }}
            control={
              <div className={styles.uploadControl}>
                <Icon name="buttonEdit" className={cn(styles.uploadIcon)} />
              </div>
            }
          />
        </div>
      )}
      {renderContent()}
    </section>
  );

  if (isNextVersion) {
    return pageContent;
  }

  return <MainLayout className={styles.headerLayout}>{pageContent}</MainLayout>;
};
