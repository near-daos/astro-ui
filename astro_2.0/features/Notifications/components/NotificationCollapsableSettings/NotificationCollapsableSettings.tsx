// TODO requires localisation

import React, { FC } from 'react';
import cn from 'classnames';
import { useMedia } from 'react-use';
import { shortenString } from 'utils/format';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Toggle } from 'components/inputs/Toggle';
import { IconButton } from 'components/button/IconButton';
import { Collapsable } from 'components/collapsable/Collapsable';
import { DaoLogo } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLogo';
import { NotificationSettingsItem } from 'types/notification';

import styles from './NotificationCollapsableSettings.module.scss';

interface NotificationCollapsableSettingsProps {
  daoId: string;
  flagCover?: string;
  flagBack?: string;
  daoName: string;
  daoAddress: string;
  settings: NotificationSettingsItem[];
  groupId: string;
  onToggleDao: (daoId: string, groupId: string) => void;
  onToggleSettings: (id: string, daoId: string, groupId: string) => void;
  isMuted: boolean;
}

export const NotificationCollapsableSettings: FC<
  NotificationCollapsableSettingsProps
> = ({
  daoId,
  flagCover,
  flagBack,
  daoName,
  daoAddress,
  settings,
  groupId,
  onToggleDao,
  onToggleSettings,
  isMuted,
}) => {
  const isMobile = useMedia('(max-width: 920px)');

  return (
    <Collapsable
      key={daoId}
      renderHeading={(toggle, isOpen) => (
        <section
          tabIndex={-1}
          role="button"
          className={cn(styles.groupSection, {
            [styles.open]: isOpen,
            [styles.muted]: isMuted,
          })}
          onKeyDown={e => e.key === 'Spacebar' && toggle()}
        >
          <div className={styles.flagWrapper}>
            <DaoLogo src={flagCover || flagBack} size="md" />
          </div>
          <div className={styles.daoDetails}>
            <div className={cn(styles.inline)}>{daoName}</div>
            <div className={cn(styles.sub)}>
              <CopyButton text={daoAddress} tooltipPlacement="auto">
                <div className={styles.addressId}>
                  {shortenString(daoAddress, isMobile ? 20 : 36)}
                </div>
              </CopyButton>
            </div>
          </div>
          <div className={styles.toggle}>
            <Toggle
              id={`${daoId}-${groupId}`}
              checked={settings.filter(item => item.checked).length !== 0}
              label={
                settings.filter(item => item.checked).length !== 0
                  ? 'Enabled'
                  : 'Disabled'
              }
              onClick={() => onToggleDao(daoId, groupId)}
            />
          </div>
          <IconButton
            onClick={() => toggle()}
            className={styles.collapseControl}
            iconProps={{
              style: {
                transform: isOpen ? 'rotate(-180deg)' : undefined,
                transition: 'all 100ms',
              },
            }}
            icon="buttonArrowDown"
            size="small"
          />
        </section>
      )}
    >
      {(isOpen: boolean) => {
        return (
          <div
            className={cn(styles.collapsableListItem, {
              [styles.open]: isOpen,
            })}
          >
            {settings.map(({ id, checked, title }) => (
              <div key={id} className={styles.settingsItem}>
                <Toggle
                  id={id}
                  label={title}
                  checked={checked}
                  onClick={() => onToggleSettings(id, daoId, groupId)}
                />
              </div>
            ))}
          </div>
        );
      }}
    </Collapsable>
  );
};
