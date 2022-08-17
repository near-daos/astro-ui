import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';
import { Radio } from 'astro_2.0/components/inputs/radio/Radio';

import { intervalOptions } from 'astro_2.0/features/Discover/constants';

import styles from './ChartInterval.module.scss';

export type ChartIntervalProps = {
  interval: string;
  setInterval: (value: string) => void;
};

export const ChartInterval: FC<ChartIntervalProps> = ({
  interval,
  setInterval,
}) => {
  const { t } = useTranslation();

  return (
    <RadioGroup
      className={styles.radioGroup}
      value={interval}
      onChange={setInterval}
    >
      {intervalOptions.map((option: { value: string; label: string }) => (
        <Radio
          key={option.value}
          value={option.value}
          label={t(`chart.${option.label}`)}
        />
      ))}
    </RadioGroup>
  );
};
