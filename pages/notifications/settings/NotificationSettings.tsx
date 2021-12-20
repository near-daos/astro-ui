import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { NotificationsDisableModal } from 'astro_2.0/components/NotificationsDisableModal';
import { useModal } from 'components/modal';
import { Toggle } from 'components/inputs/Toggle';
import { Collapsable } from 'components/collapsable/Collapsable';
import { IconButton } from 'components/button/IconButton';
import {
  NotificationSettingsGroup,
  NotificationSettingsPlatform,
  NotificationSettingsType,
  NotificationsGroupStatus,
} from 'types/notification';
import {
  NOTIFICATION_SETTINGS_GROUPS_DATA,
  NOTIFICATION_SETTINGS_PLATFORM_DATA,
  NOTIFICATION_SETTINGS_TYPES,
} from 'mocks/notificationsData';

import { shortenString } from 'helpers/format';

import styles from './NotificationSettings.module.scss';

interface NotificationSettingsProps {
  settingsGroupsData: NotificationSettingsGroup[];
  settingsPlatformData: NotificationSettingsPlatform;
  settingsTypes: NotificationSettingsType[];
}

const NotificationSettings: FC<NotificationSettingsProps> = ({
  settingsGroupsData = NOTIFICATION_SETTINGS_GROUPS_DATA,
  settingsPlatformData = NOTIFICATION_SETTINGS_PLATFORM_DATA,
  settingsTypes = NOTIFICATION_SETTINGS_TYPES,
}) => {
  const [settingsState, setSettingsState] = useState({
    groups: settingsGroupsData,
    platform: settingsPlatformData,
  });

  const toggleSettingsSwitch = (id: string, daoId: string, groupId: string) => {
    setSettingsState({
      ...settingsState,
      groups: settingsState.groups.map(group =>
        group.groupId === groupId
          ? {
              ...group,
              daos: group.daos?.map(dao =>
                dao.daoId === daoId
                  ? {
                      ...dao,
                      settings: dao.settings.map(item =>
                        item.id === id
                          ? { ...item, checked: !item.checked }
                          : item
                      ),
                    }
                  : dao
              ),
            }
          : group
      ),
    });
  };

  const togglePlatformSwitch = (id: string) => {
    setSettingsState({
      ...settingsState,
      platform: {
        ...settingsState.platform,
        settings: settingsState.platform.settings.map(item =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      },
    });
  };

  const toggleDaoSwitch = (daoId: string, groupId: string) => {
    const currentGroup = settingsState.groups.filter(
      group => group.groupId === groupId
    )[0];
    const currentDao = currentGroup.daos?.filter(dao => dao.daoId === daoId)[0];
    const currentDaoChecked =
      currentDao?.settings.filter(item => item.checked).length !== 0;

    setSettingsState({
      ...settingsState,
      groups: settingsState.groups.map(group =>
        group.groupId === groupId
          ? {
              ...group,
              daos: group.daos?.map(dao =>
                dao.daoId === daoId
                  ? {
                      ...dao,
                      settings: dao.settings.map(item => {
                        return { ...item, checked: !currentDaoChecked };
                      }),
                    }
                  : dao
              ),
            }
          : group
      ),
    });
  };

  const [showModal] = useModal(NotificationsDisableModal, {
    text: 'Choose for how long you would like to disable global notifications.',
  });

  const openGroupSettingsModal = useCallback(
    async type => {
      await showModal(type);
    },
    [showModal]
  );

  const toggleGroupSwitch = (
    type: string,
    typeStatus: NotificationsGroupStatus
  ) => {
    if (typeStatus === NotificationsGroupStatus.Enabled) {
      openGroupSettingsModal(type);
    } else if (type === 'platform') {
      setSettingsState({
        ...settingsState,
        platform: {
          ...settingsState.platform,
          status: NotificationsGroupStatus.Enabled,
        },
      });
    } else {
      setSettingsState({
        ...settingsState,
        groups: settingsState.groups.map(group =>
          group.groupId === type
            ? {
                ...group,
                status: NotificationsGroupStatus.Enabled,
              }
            : group
        ),
      });
    }
  };

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/notifications">Notifications</NavLink>
        <span>Notification Settings</span>
      </BreadCrumbs>
      <div className={styles.title}>Notification settings</div>

      <div className={styles.settings}>
        {settingsState.groups.map(({ groupId, groupName, status, daos }) => (
          <div key={groupId} className={styles.group}>
            {daos && daos.length > 0 && (
              <>
                <div className={styles.groupHeader}>
                  <div className={styles.groupTitle}>
                    {groupName} ({daos.length})
                  </div>
                  <Toggle
                    id={groupId}
                    checked={status === 'Enabled'}
                    groupSwitch
                    onClick={() => toggleGroupSwitch(groupId, status)}
                  />
                </div>
                {daos?.map(
                  ({
                    daoId,
                    daoName,
                    daoAddress,
                    flagCover,
                    flagBack,
                    settings,
                  }) => (
                    <Collapsable
                      key={daoId}
                      renderHeading={(toggle, isOpen) => (
                        <section
                          tabIndex={-1}
                          role="button"
                          className={styles.groupSection}
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
                            <div className={cn(styles.inline)}>
                              <b>{daoName}</b>
                            </div>
                            <div className={cn(styles.inline, styles.sub)}>
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
                              checked={
                                settings.filter(item => item.checked).length !==
                                0
                              }
                              label={
                                settings.filter(item => item.checked).length !==
                                0
                                  ? 'Disable all'
                                  : 'Enable all'
                              }
                              onClick={() => toggleDaoSwitch(daoId, groupId)}
                            />
                          </div>
                          <IconButton
                            onClick={() => toggle()}
                            className={styles.collapseControl}
                            iconProps={{
                              style: {
                                transform: isOpen
                                  ? 'rotate(-180deg)'
                                  : undefined,
                                transition: 'all 100ms',
                              },
                            }}
                            icon="buttonArrowDown"
                            size="small"
                          />
                        </section>
                      )}
                    >
                      {settingsTypes.map(({ typeId, typeName }) => (
                        <div
                          key={typeId}
                          className={styles.collapsableListItem}
                        >
                          {typeName && (
                            <div className={styles.type}>{typeName}</div>
                          )}
                          {settings
                            .filter(item => item.type === typeId)
                            .map(({ id, checked, title }) => (
                              <div key={id} className={styles.settingsItem}>
                                <Toggle
                                  id={id}
                                  label={title}
                                  checked={checked}
                                  onClick={() =>
                                    toggleSettingsSwitch(id, daoId, groupId)
                                  }
                                />
                              </div>
                            ))}
                        </div>
                      ))}
                    </Collapsable>
                  )
                )}
              </>
            )}
          </div>
        ))}

        <div className={styles.group}>
          <div className={cn(styles.groupHeader, styles.platformSettings)}>
            <div className={styles.groupTitle}>
              {settingsState.platform.name}
            </div>
            <Toggle
              id={settingsState.platform.id}
              checked={settingsState.platform.status === 'Enabled'}
              groupSwitch
              onClick={() =>
                toggleGroupSwitch(
                  settingsState.platform.id,
                  settingsState.platform.status
                )
              }
            />
          </div>
          {settingsState.platform.settings.map(({ id, checked, title }) => (
            <div key={id} className={cn(styles.settingsItem)}>
              <Toggle
                id={id}
                label={title}
                checked={checked}
                onClick={() => togglePlatformSwitch(id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
