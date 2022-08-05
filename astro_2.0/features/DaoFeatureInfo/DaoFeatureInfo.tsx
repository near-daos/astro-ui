import React, { FC, ReactNode, useEffect, useState } from 'react';
import get from 'lodash/get';
import { useAsyncFn, useMountedState } from 'react-use';

import { DaoWarning } from 'astro_2.0/components/DaoWarning';

import { DAO } from 'types/dao';
import { Settings } from 'types/settings';

import { IconName } from 'components/Icon';

import { useDaoSettings } from 'context/DaoSettingsContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { Button } from 'components/button/Button';

import styles from './DaoFeatureInfo.module.scss';

interface Props {
  dao: DAO;
  icon?: IconName;
  title: string;
  description: string;
  featureKey: string;
  control?: (cb: () => void) => ReactNode;
}

export const DaoFeatureInfo: FC<Props> = ({
  dao,
  featureKey,
  icon = 'buttonRefresh',
  title,
  description,
  control,
}) => {
  const isMounted = useMountedState();
  const [showInfo, setShowInfo] = useState(false);
  const { settings, update: updateSettings } = useDaoSettings();

  useEffect(() => {
    if (settings && !get(settings, `features.${featureKey}`) && isMounted()) {
      setShowInfo(true);
    }
  }, [dao.id, featureKey, isMounted, settings]);

  const [, handleDismiss] = useAsyncFn(async () => {
    try {
      if (!settings) {
        return;
      }

      const newSettings: Settings = {
        features: settings.features
          ? {
              ...settings.features,
              [featureKey]: true,
            }
          : {
              [featureKey]: true,
            },
      };

      await updateSettings(newSettings);

      setShowInfo(false);
    } catch (err) {
      const { message } = err;

      showNotification({
        type: NOTIFICATION_TYPES.ERROR,
        lifetime: 20000,
        description: message,
      });
    }
  }, [dao.id, settings, updateSettings]);

  if (!showInfo) {
    return null;
  }

  return (
    <DaoWarning
      rootClassName={styles.root}
      statusClassName={styles.status}
      iconClassName={styles.icon}
      icon={icon}
      content={
        <>
          <div className={styles.title}>{title}</div>
          <div className={styles.text}>{description}</div>
        </>
      }
      control={
        <div className={styles.control}>
          {control && control(handleDismiss)}{' '}
          <Button variant="tertiary" capitalize onClick={handleDismiss}>
            Not now
          </Button>
        </div>
      }
      className={styles.warningWrapper}
    />
  );
};
