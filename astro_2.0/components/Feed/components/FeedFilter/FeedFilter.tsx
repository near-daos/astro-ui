import cn from 'classnames';
import React, { useCallback, useState } from 'react';

import { Icon } from 'components/Icon';
import RadioGroup, {
  Radio,
  RadioProps,
} from 'astro_2.0/components/inputs/Radio';

import styles from './FeedFilter.module.scss';

type FeedFilterProps<T> = {
  className?: string;
  headerClassName?: string;
  title: string;
  shortTitle?: string;
  children: React.ReactElement<RadioProps, typeof Radio>[];
  value: T;
  onChange: (value: T, e?: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FeedFilter = <T,>({
  title,
  shortTitle,
  className,
  headerClassName,
  children,
  value,
  onChange,
}: FeedFilterProps<T>): JSX.Element => {
  const [isShow, setIsShow] = useState(false);

  const handleChange = useCallback(
    (newValue: string, e?: React.ChangeEvent<HTMLInputElement>) => {
      onChange((newValue as unknown) as T, e);

      if (isShow) {
        setIsShow(false);
      }
    },
    [isShow, onChange]
  );

  return (
    <div className={cn(styles.root, className)}>
      <div
        role="button"
        tabIndex={0}
        className={cn(styles.header, headerClassName)}
        onClick={() => setIsShow(!isShow)}
        onKeyDown={() => setIsShow(!isShow)}
      >
        <p className={styles.title}>{shortTitle || title}</p>
        <Icon className={styles.controlIcon} name="listFilter" />
      </div>
      <RadioGroup
        className={cn(styles.radioGroup, { [styles.show]: isShow })}
        itemClassName={styles.radio}
        activeItemClassName={styles.activeRadio}
        value={((value as unknown) as string) || ''}
        onChange={handleChange}
      >
        {children}
      </RadioGroup>
    </div>
  );
};
