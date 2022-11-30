import React, { FC } from 'react';
import { CircleFlag } from 'react-circle-flags';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Button } from 'components/button/Button';

import styles from './Locales.module.scss';

export const Locales: FC = () => {
  const router = useRouter();

  return (
    <div className={styles.root}>
      {router?.locales?.map(locale => {
        return (
          <Button
            key={locale}
            size="small"
            variant="tertiary"
            className={styles.locale}
            onClick={() => {
              router.push(router.asPath, router.asPath, { locale });
            }}
          >
            <CircleFlag
              countryCode={locale === 'en' ? 'us' : locale}
              className={cn(styles.flag, {
                [styles.nonEn]: locale !== 'en',
              })}
            />{' '}
            {locale}
          </Button>
        );
      })}
    </div>
  );
};
