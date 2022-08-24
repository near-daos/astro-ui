import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { SideFilter } from 'astro_2.0/components/SideFilter';

import styles from './SettingsFilterToggle.module.scss';

const TEMP_DISABLED_OPTIONS = [
  // 'proposalCreation',
  // 'votingPermissions',
  // 'groups',
  'members',
  'daoRules',
  'groupNames',
];

const POLICY_OPTIONS = [
  'proposalCreation',
  'votingPermissions',
  // 'votingPolicy',
  'bondAndDeadlines',
  'groups',
  'drafts',
  'members',
  'daoRules',
];

interface SettingsFilterToggleProps {
  variant: 'daoConfig' | 'daoPolicy';
}

export const SettingsFilterToggle: FC<SettingsFilterToggleProps> = ({
  variant,
}) => {
  const { t } = useTranslation();

  const daoConfigFilterOptions = useMemo(() => {
    const keys = [
      'nameAndPurpose',
      'legalStatusAndDoc',
      'links',
      'flagAndLogo',
      'groupNames',
    ];

    return keys.map(key => ({
      label: t(`settingsPage.${key}`),
      value: key,
      disabled: TEMP_DISABLED_OPTIONS.includes(key),
    }));
  }, [t]);

  const daoPolicyFilterOptions = useMemo(() => {
    return POLICY_OPTIONS.map(key => ({
      label: t(`settingsPage.${key}`),
      value: key,
      disabled: TEMP_DISABLED_OPTIONS.includes(key),
    }));
  }, [t]);

  return (
    <div className={styles.root}>
      <div className={styles.filters}>
        {variant === 'daoConfig' && (
          <SideFilter
            hideAllOption
            queryName="daoFilter"
            list={daoConfigFilterOptions}
            title={t('daoConfig')}
            className={styles.daoConfigFilter}
          />
        )}
        {variant === 'daoPolicy' && (
          <SideFilter
            hideAllOption
            forceHorizontalView
            queryName="daoFilter"
            list={daoPolicyFilterOptions}
            title={t('settingsPage.daoPolicy')}
            className={styles.daoPolicyFilter}
          />
        )}
      </div>
    </div>
  );
};
