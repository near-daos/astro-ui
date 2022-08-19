import React, { FC } from 'react';
import cn from 'classnames';
import { Toggle } from 'components/inputs/Toggle';
import {
  NotificationSettingsGroup,
  NotificationSettingsPlatform,
  NotificationsGroupStatus,
} from 'types/notification';

import styles from './PlatformNotificationSettings.module.scss';

interface PlatformNotificationSettingsProps {
  settingsState: {
    groups: NotificationSettingsGroup[];
    platform: NotificationSettingsPlatform;
  };
  onToggleGroup: (id: string, status: NotificationsGroupStatus) => void;
  onTogglePlatform: (id: string) => void;
}

export const PlatformNotificationSettings: FC<
  PlatformNotificationSettingsProps
> = ({ settingsState, onToggleGroup, onTogglePlatform }) => {
  return (
    <div className={styles.group}>
      <div className={cn(styles.groupHeader, styles.platformSettings)}>
        <div className={styles.groupTitle}>{settingsState.platform.name}</div>
        <Toggle
          id={settingsState.platform.id}
          checked={
            settingsState.platform.status === NotificationsGroupStatus.Enabled
          }
          groupSwitch
          onClick={() =>
            onToggleGroup(
              settingsState.platform.id,
              settingsState.platform.status
            )
          }
        />
      </div>
      {settingsState.platform.settings.map(({ id, checked, title }) => (
        <div
          key={id}
          className={cn(styles.settingsItem, {
            [styles.muted]:
              settingsState.platform.status ===
              NotificationsGroupStatus.Disable,
          })}
        >
          <Toggle
            id={id}
            label={title}
            checked={checked}
            onClick={() => onTogglePlatform(id)}
          />
        </div>
      ))}
    </div>
  );
};
