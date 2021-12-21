import React, { FC } from 'react';
import cn from 'classnames';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { shortenString } from 'helpers/format';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { Toggle } from 'components/inputs/Toggle';
import { IconButton } from 'components/button/IconButton';
import { Collapsable } from 'components/collapsable/Collapsable';
import {
  NotificationSettingsItem,
  NotificationSettingsType,
} from 'types/notification';

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
  settingsTypes: NotificationSettingsType[];
  onToggleSettings: (id: string, daoId: string, groupId: string) => void;
}

export const NotificationCollapsableSettings: FC<NotificationCollapsableSettingsProps> = ({
  daoId,
  flagCover,
  flagBack,
  daoName,
  daoAddress,
  settings,
  groupId,
  onToggleDao,
  settingsTypes,
  onToggleSettings,
}) => {
  return (
    <Collapsable
      key={daoId}
      renderHeading={(toggle, isOpen) => (
        <section
          tabIndex={-1}
          role="button"
          className={cn(styles.groupSection, {
            [styles.open]: isOpen,
          })}
          onKeyDown={e => e.key === 'Spacebar' && toggle()}
        >
          <div className={styles.flagWrapper}>
            <FlagRenderer
              className={styles.flag}
              flag={flagCover}
              size="xs"
              fallBack={flagBack}
            />
          </div>
          <div className={styles.daoDetails}>
            <div className={cn(styles.inline)}>{daoName}</div>
            <div className={cn(styles.sub)}>
              {shortenString(daoAddress, 36)}
              <CopyButton
                text={daoAddress}
                tooltipPlacement="auto"
                className={styles.copyAddress}
              />
            </div>
          </div>
          <div className={styles.toggle}>
            <Toggle
              id={`${daoId}-${groupId}`}
              checked={settings.filter(item => item.checked).length !== 0}
              label={
                settings.filter(item => item.checked).length !== 0
                  ? 'Disable all'
                  : 'Enable all'
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
        return settingsTypes.map(({ typeId, typeName }) => (
          <div
            key={typeId}
            className={cn(styles.collapsableListItem, {
              [styles.open]: isOpen,
            })}
          >
            {typeName && <div className={styles.type}>{typeName}</div>}
            {settings
              .filter(item => item.type === typeId)
              .map(({ id, checked, title }) => (
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
        ));
      }}
    </Collapsable>
  );
};
