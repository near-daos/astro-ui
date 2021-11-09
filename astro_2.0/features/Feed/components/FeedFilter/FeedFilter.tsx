import React, { useCallback, useState } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';
import RadioGroup, {
  Radio,
  RadioProps,
} from 'astro_2.0/components/inputs/Radio';

import styles from './FeedFilter.module.scss';

type FeedFilterProps<T> = {
  className?: string;
  title: string;
  shortTitle?: string;
  children: React.ReactElement<RadioProps, typeof Radio>[];
  value: T;
  onChange: (value: T) => void;
};

export const FeedFilter = <T,>({
  title,
  shortTitle,
  className,
  children,
  value,
  onChange,
}: FeedFilterProps<T>): JSX.Element => {
  const [isShow, setIsShow] = useState(false);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange((newValue as unknown) as T);

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
        className={styles.header}
        onClick={() => setIsShow(!isShow)}
        onKeyDown={() => setIsShow(!isShow)}
      >
        <p className={styles.title}>{shortTitle || title}</p>
        <Icon className={styles.controlIcon} name="listFilter" />
      </div>
      <RadioGroup
        className={cn(styles.radioGroup, { [styles.show]: isShow })}
        itemClassName={styles.radio}
        activeItemCalssName={styles.activeRadio}
        value={((value as unknown) as string) || ''}
        onChange={handleChange}
      >
        {children}
      </RadioGroup>
    </div>
  );
};
