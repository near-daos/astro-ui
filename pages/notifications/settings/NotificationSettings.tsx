import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { NavLink } from 'astro_2.0/components/NavLink';
import { NotificationsDisableModal } from 'astro_2.0/components/NotificationsDisableModal';
import { useModal } from 'components/modal';
import { useTranslation } from 'next-i18next';
import { Toggle } from 'components/inputs/Toggle';
import { NotificationCollapsableSettings } from 'astro_2.0/features/Notifications/components/NotificationCollapsableSettings';
import { PlatformNotificationSettings } from 'astro_2.0/features/Notifications/components/PlatformNotificationSettings';
import {
  NotificationsGroupStatus,
  NotifiedActionType,
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
import { SideFilter } from 'astro_2.0/components/SideFilter';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import { Page } from 'pages/_app';

import styles from './NotificationSettings.module.scss';

interface NotificationSettingsProps {
  myDaos: DaoSettings[];
  subscribedDaos: DaoSettings[];
  platformSettings: NotificationSettingDTO[];
}

const NotificationSettings: Page<NotificationSettingsProps> = ({
  myDaos,
  subscribedDaos,
  platformSettings,
}) => {
  const router = useRouter();
  const showPlatform = router.query.notyType === 'platformWide';
  const showSubscribed = router.query.notyType === 'subscribed';
  const showYourDaos =
    !router.query.notyType || router.query.notyType === 'yourDaos';
  const { t } = useTranslation('notificationsPage');
  const settingsGroups = prepareSettingsGroups(myDaos, subscribedDaos);
  const settingsPlatform = prepareSettingsPlatform(platformSettings, t);
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

      updateSettings({
        daoId,
        types: types ?? [],
      });
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

    updateSettings({
      types: [...types, ...DAO_RELATED_SETTINGS],
    });
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

      updateSettings({
        daoId,
        types: types ?? [],
      });
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

      const types = extractTypes(settingsState.platform.settings);
      const isMuted = newStatus === NotificationsGroupStatus.Disable;

      const newSettings = settingsState.platform.settings.map(item => {
        if (isMuted && delay === 0) {
          return { ...item, checked: false };
        }

        if (!isMuted && !types.length) {
          return { ...item, checked: true };
        }

        return item;
      });

      setSettingsState({
        ...settingsState,
        platform: {
          ...settingsState.platform,
          status: newStatus,
          settings: newSettings,
        },
      });

      const newTypes = newSettings.reduce<NotifiedActionType[]>((res, item) => {
        if (item.checked) {
          res.push(item.notificationType);
        }

        return res;
      }, []);

      updateSettings({
        types:
          isMuted && delay === 0
            ? DAO_RELATED_SETTINGS
            : [...newTypes, ...DAO_RELATED_SETTINGS],
        isAllMuted: isMuted,
        mutedUntilTimestamp: `${delay}`,
      });
    } else {
      const newStatus =
        typeStatus === NotificationsGroupStatus.Enabled
          ? NotificationsGroupStatus.Disable
          : NotificationsGroupStatus.Enabled;

      setSettingsState({
        ...settingsState,
        groups: settingsState.groups.map(group =>
          group.groupId === type
            ? {
                ...group,
                status: newStatus,
              }
            : group
        ),
      });

      const selectedGroup = settingsState.groups.find(
        group => group.groupId === type
      );

      await Promise.all(
        selectedGroup?.daos?.map(dao => {
          const types = extractTypes(dao.settings);

          return updateSettings({
            daoId: dao.daoId,
            types,
            isAllMuted: newStatus === NotificationsGroupStatus.Disable,
            mutedUntilTimestamp: `${delay}`,
          });
        }) ?? []
      );
    }
  };

  const filterOptions = useMemo(() => {
    const keys = ['yourDaos', 'subscribed', 'platformWide'];

    return keys.map(key => ({
      label: t(key),
      value: key,
    }));
  }, [t]);

  return (
    <div className={styles.root}>
      <BreadCrumbs className={styles.breadcrumbs}>
        <NavLink href="/notifications">Notifications</NavLink>
        <span>Notification Settings</span>
      </BreadCrumbs>
      <div className={styles.title}>Notification settings</div>

      <SideFilter
        hideAllOption
        queryName="notyType"
        list={filterOptions}
        title={t('notificationsSettings')}
        className={styles.sideFilter}
      />

      <div className={styles.settings}>
        {settingsState.groups
          .filter(item => {
            if (showYourDaos && item.groupId === 'my') {
              return true;
            }

            return showSubscribed && item.groupId === 'subscribed';
          })
          .map(({ groupId, groupName, status, daos }) => (
            <div key={groupId} className={styles.group}>
              {daos && daos.length > 0 && (
                <>
                  <div className={styles.groupHeader}>
                    <div className={styles.groupTitle}>
                      {groupName} ({daos.length})
                    </div>
                    <Toggle
                      id={groupId}
                      checked={status === NotificationsGroupStatus.Enabled}
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
                        key={daoId}
                        daoId={daoId}
                        flagCover={flagCover}
                        flagBack={flagBack}
                        daoName={daoName}
                        daoAddress={daoAddress}
                        settings={settings}
                        groupId={groupId}
                        isMuted={status === NotificationsGroupStatus.Disable}
                        onToggleDao={toggleDaoSwitch}
                        onToggleSettings={toggleSettingsSwitch}
                      />
                    )
                  )}
                </>
              )}
            </div>
          ))}

        {showPlatform && (
          <PlatformNotificationSettings
            onToggleGroup={toggleGroupSwitch}
            onTogglePlatform={togglePlatformSwitch}
            settingsState={settingsState}
          />
        )}
      </div>
    </div>
  );
};

NotificationSettings.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default NotificationSettings;
