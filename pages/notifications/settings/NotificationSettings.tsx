import React, { FC, useState, useCallback } from 'react';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { FlagRenderer } from 'astro_2.0/components/Flag';
import { useModal } from 'components/modal';
import { NotificationsDisableModal } from 'astro_2.0/components/NotificationsDisableModal';
import { Toggle } from 'components/inputs/Toggle';
import {
  NotificationSettingsGroup,
  NotificationSettingsPlatform,
  NotificationsGroupStatus,
  NotificationSettingsGroupOld,
  NotificationSettingsItemOld,
  NotificationSettingsType,
} from 'types/notification';
import {
  NOTIFICATION_SETTINGS_GROUPS_DATA,
  NOTIFICATION_SETTINGS_PLATFORM_DATA,
  NOTIFICATION_SETTINGS_TYPES,
  NOTIFICATION_SETTINGS_GROUPS_DATA_OLD,
  NOTIFICATION_SETTINGS_DATA_OLD,
} from 'mocks/notificationsData';
import styles from './NotificationSettings.module.scss';

interface NotificationSettingsProps {
  settingGroupsData: NotificationSettingsGroup[];
  settingPlatformData: NotificationSettingsPlatform;
  settingTypes: NotificationSettingsType[];
  settingGroups: NotificationSettingsGroupOld[];
  settingsData: NotificationSettingsItemOld[];
}

const NotificationSettings: FC<NotificationSettingsProps> = ({
  settingGroupsData = NOTIFICATION_SETTINGS_GROUPS_DATA,
  settingPlatformData = NOTIFICATION_SETTINGS_PLATFORM_DATA,
  settingTypes = NOTIFICATION_SETTINGS_TYPES,
  settingGroups = NOTIFICATION_SETTINGS_GROUPS_DATA_OLD,
  settingsData = NOTIFICATION_SETTINGS_DATA_OLD,
}) => {
  const [settingsState, setSettingsState] = useState({
    settings: settingsData,
  });

  const {
    name: platformName,
    settings: platformSettings,
  } = settingPlatformData;

  const [settingsGroupState, setSettingsGroupState] = useState({
    groups: settingGroups,
  });

  // Switch one Group Notifications
  const toggleSettingsSwitch = useCallback((id: string) => {
    setSettingsState(previousState => {
      const { settings } = previousState;
      const selectedIndex = settings.findIndex(option => option.id === id);

      return {
        ...previousState,
        settings: [
          ...settings.slice(0, selectedIndex),
          {
            ...settings[selectedIndex],
            checked: !settings[selectedIndex].checked,
          },
          ...settings.slice(selectedIndex + 1),
        ],
      };
    });
  }, []);

  // Disable Notifications modal fot Group Notifications
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
    } else {
      setSettingsGroupState({
        groups: settingsGroupState.groups.map(group =>
          group.type === type
            ? {
                ...group,
                typeStatus: NotificationsGroupStatus.Enabled,
              }
            : group
        ),
      });
    }
  };

  /*
  const toggleGroupSwitchModal = useCallback(
    async (type, typeStatus) => {
      if (typeStatus === 'Enabled') {
        await showModal(type);
      } else {
        console.log('enable notifications');
      }
    },
    [showModal]
  );

  // Switch all Group Notifications
  const toggleGroupSwitchAll = (type: string) => {
    const currentGroupValue =
      settingsState.settings.filter(item => !item.checked && item.type === type)
        .length === 0;

    setSettingsState({
      settings: settingsState.settings.map(item =>
        item.type === type
          ? {
            ...item,
            checked: !currentGroupValue,
          }
          : item
      ),
    });
  };
  */

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/notifications">Notifications</NavLink>
        <span>Notification Settings</span>
      </BreadCrumbs>
      <div className={styles.title}>Notification settings</div>

      <div>
        {settingGroupsData.map(({ groupId, groupName, daos }) => (
          <div key={groupId}>
            {daos?.length && daos.length > 0 && (
              <div>
                <h2>
                  {groupId} <b>{groupName}</b>
                </h2>
                {daos?.map(
                  ({
                    daoId,
                    daoName,
                    daoAddress,
                    flagCover,
                    flagBack,
                    settings,
                  }) => (
                    <div key={daoId}>
                      {daoId} <b>{daoName}</b> {daoAddress}
                      <FlagRenderer
                        flag={flagCover}
                        size="xs"
                        fallBack={flagBack}
                      />
                      {settingTypes.map(({ typeId, typeName }) => (
                        <div key={typeId}>
                          <h4>
                            {typeId} {typeName && <b>{typeName}</b>}
                          </h4>
                          {settings
                            .filter(item => item.type === typeId)
                            .map(({ id, checked, title }) => (
                              <Toggle
                                key={id}
                                id={id}
                                label={title}
                                checked={checked}
                                onClick={() => true}
                              />
                            ))}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
        <>
          <h2>
            <b>{platformName}</b>
          </h2>
          {platformSettings.map(({ id, checked, title }) => (
            <Toggle
              key={id}
              id={id}
              label={title}
              checked={checked}
              onClick={() => true}
            />
          ))}
        </>
      </div>

      <div className={styles.settings}>
        {settingsGroupState.groups.map(
          ({ type, typeName, typeStatus, subtypes }) => (
            <div key={type} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{typeName}</div>
                <Toggle
                  id={type}
                  checked={typeStatus === 'Enabled'}
                  /*
                checked={
                  settingsState.settings.filter(
                    item => !item.checked && item.type === type
                  ).length === 0
                }
                */
                  groupSwitch
                  onClick={() => toggleGroupSwitch(type, typeStatus)}
                />
              </div>
              {subtypes.map(({ subType, subTypeName }) => (
                <div key={subType}>
                  {subTypeName && (
                    <div className={styles.subType}>{subTypeName}</div>
                  )}
                  {settingsState.settings
                    .filter(
                      item => item.type === type && item.subType === subType
                    )
                    .map(({ id, title, checked }) => (
                      <div key={id} className={styles.settingsItem}>
                        <Toggle
                          id={id}
                          label={title}
                          checked={checked}
                          mobileListView
                          onClick={() => toggleSettingsSwitch(id)}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
