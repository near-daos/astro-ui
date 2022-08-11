import React, { FC, useMemo } from 'react';

import { Persona } from 'astro_2.0/components/MaintenanceWarning/components/Persona';
import { Star } from 'astro_2.0/components/MaintenanceWarning/components/Star';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import styles from './MaintenanceWarning.module.scss';

export const MaintenanceWarning: FC = () => {
  const stars = useMemo(() => {
    const arr = new Array(25).fill(0);

    return arr.map(() => {
      const s = Math.random() * 40;
      const width = s;
      const height = s;

      const x = Math.random() * 100;
      const y = Math.random() * 100;

      return {
        width,
        height,
        x,
        y,
        color: '000',
      };
    });
  }, []);

  return (
    <MainLayout>
      <div className={styles.root}>
        {stars.map((item, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Star key={i} {...item} color={i % 2 > 0 ? '19D992' : '8060D9'} />
          );
        })}
        <h1>
          Astro is going in maintenance mode <br />
          <span className={styles.blue}>for 2-3 hours</span> and will not be
          functional
        </h1>

        <h4 className={styles.blue}>Please stay calm</h4>

        <div>
          <Persona />
        </div>
      </div>
    </MainLayout>
  );
};
