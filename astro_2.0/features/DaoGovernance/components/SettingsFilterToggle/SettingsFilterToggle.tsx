import React, { FC, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';

import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';

import styles from './SettingsFilterToggle.module.scss';

const TEMP_DISABLED_OPTIONS = [
  'proposalCreation',
  'votingPermissions',
  'groups',
  'members',
  'daoRules',
  'groupNames',
];

const POLICY_OPTIONS = [
  'proposalCreation',
  'votingPermissions',
  'votingPolicy',
  'bondAndDeadlines',
  'groups',
  'members',
  'daoRules',
];

export const SettingsFilterToggle: FC = () => {
  const router = useRouter();
  const daoFilter = router.query.daoFilter as string;
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(
    daoFilter && POLICY_OPTIONS.includes(daoFilter) ? 'daoPolicy' : 'daoConfig'
  );
  const isMobile = useMedia('(max-width: 1280px)');

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

  const handleToggle = useCallback(
    (filter: string, initialValue: string) => {
      setActiveFilter(filter);
      router.replace(
        {
          pathname: '',
          query: {
            ...router.query,
            daoFilter: initialValue,
          },
        },
        undefined,
        {
          shallow: false,
          scroll: false,
        }
      );
    },
    [router]
  );

  return (
    <div className={styles.root}>
      <div className={styles.toggle}>
        <Button
          variant="tertiary"
          size="block"
          className={cn(styles.button, {
            [styles.active]: activeFilter === 'daoConfig',
          })}
          onClick={() => handleToggle('daoConfig', 'nameAndPurpose')}
        >
          {t('daoConfig')}
        </Button>
        <Button
          variant="tertiary"
          size="block"
          className={cn(styles.button, {
            [styles.active]: activeFilter === 'daoPolicy',
          })}
          onClick={() => handleToggle('daoPolicy', 'votingPolicy')}
        >
          {t('settingsPage.daoPolicy')}
        </Button>
      </div>
      <div className={styles.filters}>
        {(!isMobile || activeFilter === 'daoConfig') && (
          <SideFilter
            hideAllOption
            queryName="daoFilter"
            list={daoConfigFilterOptions}
            title={t('daoConfig')}
            className={styles.daoConfigFilter}
          />
        )}
        {(!isMobile || activeFilter === 'daoPolicy') && (
          <SideFilter
            hideAllOption
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
