import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { Dropdown } from 'components/Dropdown';

import styles from './LocaleSelector.module.scss';

export const LocaleSelector: FC = () => {
  const router = useRouter();

  return (
    <div className={styles.root}>
      <Dropdown
        className={styles.select}
        value={router.locale}
        onChange={v => {
          router.push(router.asPath, router.asPath, { locale: v });
        }}
        options={
          router.locales?.map(item => ({
            label: item,
            value: item,
          })) ?? []
        }
      />
    </div>
  );
};
