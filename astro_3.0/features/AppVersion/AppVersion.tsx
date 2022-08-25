import React, { FC, useCallback } from 'react';
import { CardTitle } from 'astro_2.0/features/pages/myAccount/cards/CardTitle';
import { ConfigCard } from 'astro_2.0/features/pages/myAccount/cards/ConfigCard';
import styles from 'astro_2.0/components/NotificationsDisableModal/NotificationsDisableModal.module.scss';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';
import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';
import { useAppVersion } from 'hooks/useAppVersion';
import { useRouter } from 'next/router';
import { WarningMessage } from 'astro_2.0/components/WarningMessage';

export const AppVersion: FC = () => {
  const router = useRouter();
  const { appVersionEnabled, appVersion, updateAppVersion } = useAppVersion();

  const handleChange = useCallback(
    async val => {
      updateAppVersion(val);

      await router.reload();
    },
    [router, updateAppVersion]
  );

  if (!appVersionEnabled) {
    return null;
  }

  return (
    <ConfigCard>
      <CardTitle>Application version</CardTitle>
      <WarningMessage text="Feature is in beta" />
      <RadioGroup
        className={styles.radioGroup}
        itemClassName={styles.radio}
        activeItemClassName={styles.activeRadio}
        value={`${appVersion}`}
        onChange={handleChange}
      >
        <Radio key={2} value="2" label={2} type="version" />
        <Radio key={3} value="3" label={3} type="version" />
      </RadioGroup>
    </ConfigCard>
  );
};
