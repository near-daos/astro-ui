import React, { FC, useCallback, useState } from 'react';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { NotificationsDisableModal } from 'astro_2.0/components/NotificationsDisableModal';
import { useModal } from 'components/modal';
import { Toggle } from 'components/inputs/Toggle';
import { NotificationCollapsableSettings } from 'astro_2.0/features/Notifications/components/NotificationCollapsableSettings';
import { PlatformNotificationSettings } from 'astro_2.0/features/Notifications/components/PlatformNotificationSettings';
import {
  NotificationSettingsGroup,
  NotificationSettingsPlatform,
  NotificationsGroupStatus,
} from 'types/notification';
import { NotificationSettingDTO } from 'services/NotificationsService/types';
import {
  DAO_RELATED_SETTINGS,
  extractTypes,
  prepareSettingsGroups,
  prepareSettingsPlatform,
} from 'astro_2.0/features/Notifications';
import { useNotificationsSettings } from 'astro_2.0/features/Notifications/hooks';
import { DaoSettings } from 'astro_2.0/features/Notifications/types';

import styles from './NotificationSettings.module.scss';

interface NotificationSettingsProps {
  settingsGroupsData: NotificationSettingsGroup[];
  settingsPlatformData: NotificationSettingsPlatform;
  myDaos: DaoSettings[];
  subscribedDaos: DaoSettings[];
  platformSettings: NotificationSettingDTO[];
}

const NotificationSettings: FC<NotificationSettingsProps> = ({
  myDaos,
  subscribedDaos,
  platformSettings,
}) => {
  const settingsGroups = prepareSettingsGroups(myDaos, subscribedDaos);
  const settingsPlatform = prepareSettingsPlatform(platformSettings);
  const { updateSettings } = useNotificationsSettings();
  const [settingsState, setSettingsState] = useState({
    groups: settingsGroups,
    platform: settingsPlatform,
  });

  const toggleSettingsSwitch = (id: string, daoId: string, groupId: string) => {
    const newSettingsState = {
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
    };

    setSettingsState(newSettingsState);

    const groupData = newSettingsState.groups.find(
      item => item.groupId === groupId
    );
    const daoData = groupData?.daos?.find(item => item.daoId === daoId);

    if (daoData) {
      const types = extractTypes(daoData?.settings);

      updateSettings(daoId, types ?? []);
    }
  };

  const togglePlatformSwitch = (id: string) => {
    const newSettingsState = {
      ...settingsState,
      platform: {
        ...settingsState.platform,
        settings: settingsState.platform.settings.map(item =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      },
    };

    setSettingsState(newSettingsState);

    const types = extractTypes(newSettingsState.platform.settings);

    updateSettings(null, [...types, ...DAO_RELATED_SETTINGS]);
  };

  const toggleDaoSwitch = (daoId: string, groupId: string) => {
    const currentGroup = settingsState.groups.filter(
      group => group.groupId === groupId
    )[0];
    const currentDao = currentGroup.daos?.filter(dao => dao.daoId === daoId)[0];
    const currentDaoChecked =
      currentDao?.settings.filter(item => item.checked).length !== 0;

    const newSettingsState = {
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
    };

    setSettingsState(newSettingsState);

    const groupData = newSettingsState.groups.find(
      item => item.groupId === groupId
    );
    const daoData = groupData?.daos?.find(item => item.daoId === daoId);

    if (daoData) {
      const types = extractTypes(daoData?.settings);

      updateSettings(daoId, types ?? []);
    }
  };

  const [showModal] = useModal(NotificationsDisableModal, {
    text: 'Choose for how long you would like to disable global notifications.',
  });

  const openGroupSettingsModal = useCallback(
    async type => {
      return showModal(type);
    },
    [showModal]
  );

  const toggleGroupSwitch = async (
    type: string,
    typeStatus: NotificationsGroupStatus
  ) => {
    let delay = 0;

    if (typeStatus === NotificationsGroupStatus.Enabled) {
      const res = await openGroupSettingsModal(type);

      if (res && res[0]) {
        delay = res[0] as number;
      }
    }

    if (type === 'platform') {
      const newStatus =
        typeStatus === NotificationsGroupStatus.Enabled
          ? NotificationsGroupStatus.Disable
          : NotificationsGroupStatus.Enabled;

      setSettingsState({
        ...settingsState,
        platform: {
          ...settingsState.platform,
          status: newStatus,
        },
      });

      updateSettings(
        null,
        extractTypes(settingsState.platform.settings),
        newStatus === NotificationsGroupStatus.Disable,
        `${delay}`
      );
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
                    <NotificationCollapsableSettings
                      daoId={daoId}
                      flagCover={flagCover}
                      flagBack={flagBack}
                      daoName={daoName}
                      daoAddress={daoAddress}
                      settings={settings}
                      groupId={groupId}
                      onToggleDao={toggleDaoSwitch}
                      onToggleSettings={toggleSettingsSwitch}
                    />
                  )
                )}
              </>
            )}
          </div>
        ))}

        <PlatformNotificationSettings
          onToggleGroup={toggleGroupSwitch}
          onTogglePlatform={togglePlatformSwitch}
          settingsState={settingsState}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
