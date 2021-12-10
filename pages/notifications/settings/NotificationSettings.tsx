import React, { FC, useState, useCallback } from 'react';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { Toggle } from 'components/inputs/Toggle';
import {
  NotificationSettingsGroup,
  NotificationSettingsItem,
} from 'types/notification';
import {
  NOTIFICATION_SETTINGS_GROUPS_DATA,
  NOTIFICATION_SETTINGS_DATA,
} from 'mocks/notificationsData';
import styles from './NotificationSettings.module.scss';

interface NotificationSettingsProps {
  settingGroups: NotificationSettingsGroup[];
  settingsData: NotificationSettingsItem[];
}

const NotificationSettings: FC<NotificationSettingsProps> = ({
  settingGroups = NOTIFICATION_SETTINGS_GROUPS_DATA,
  settingsData = NOTIFICATION_SETTINGS_DATA,
}) => {
  const [settingsState, setSettingsState] = useState({
    settings: settingsData,
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

  // Switch all Group Notifications
  const toggleGroupSwitch = (type: string) => {
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

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/notifications">Notifications</NavLink>
        <span>Notification Settings</span>
      </BreadCrumbs>
      <div className={styles.title}>Notification settings</div>
      <div className={styles.settings}>
        {settingGroups.map(({ type, typeName, subtypes }) => (
          <div key={type} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>{typeName}</div>
              <Toggle
                id={type}
                checked={
                  settingsState.settings.filter(
                    item => !item.checked && item.type === type
                  ).length === 0
                }
                groupSwitch
                onClick={() => toggleGroupSwitch(type)}
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
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
