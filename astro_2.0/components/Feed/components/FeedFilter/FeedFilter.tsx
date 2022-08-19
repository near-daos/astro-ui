import cn from 'classnames';
import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';

import { PAGE_LAYOUT_ID } from 'constants/common';

import { Icon } from 'components/Icon';
import { RadioGroup } from 'astro_2.0/components/inputs/radio/RadioGroup';
import { Radio, RadioProps } from 'astro_2.0/components/inputs/radio/Radio';

import { getElementSize } from 'utils/getElementSize';
import { useWindowResize } from 'hooks/useWindowResize';

import styles from './FeedFilter.module.scss';

type FeedFilterProps<T> = {
  className?: string;
  headerClassName?: string;
  title: string;
  shortTitle?: string;
  children: React.ReactElement<RadioProps, typeof Radio>[];
  value: T;
  onChange: (value: T, e?: React.ChangeEvent<HTMLInputElement>) => void;
  neighbourRef?: MutableRefObject<HTMLElement | null>;
  selectedLabel: ReactNode | string;
};

export const FeedFilter = <T,>({
  title,
  value,
  onChange,
  children,
  className,
  shortTitle,
  neighbourRef,
  headerClassName,
  selectedLabel,
}: FeedFilterProps<T>): JSX.Element => {
  const rootRef = useRef(null);

  const [maxWidth, setMaxWidth] = useState(0);
  const [collapsed, setCollapsed] = useState<boolean | null>(null);

  const collapseFilterIfNecessary = useCallback(() => {
    const pageLayoutEl = document.getElementById(PAGE_LAYOUT_ID);

    const rootEl = rootRef?.current;
    const neighbourEl = neighbourRef?.current;

    if (pageLayoutEl && rootEl) {
      const { offsetWidth } = rootEl;
      const { width } = getElementSize(pageLayoutEl);

      if (offsetWidth > maxWidth) {
        setMaxWidth(offsetWidth);
      }

      if (neighbourEl) {
        const { widthWithMargin } = getElementSize(neighbourEl);

        setCollapsed(width < widthWithMargin + Math.max(offsetWidth, maxWidth));
      } else {
        setCollapsed(width < maxWidth);
      }
    }
  }, [maxWidth, neighbourRef, setMaxWidth, setCollapsed]);

  useWindowResize(collapseFilterIfNecessary);

  const [isShow, setIsShow] = useState(false);

  const handleChange = useCallback(
    (newValue: string, e?: React.ChangeEvent<HTMLInputElement>) => {
      onChange(newValue as unknown as T, e);

      if (isShow) {
        setIsShow(false);
      }
    },
    [isShow, onChange]
  );

  const rootClassName = cn(styles.root, className, {
    [styles.collapsed]: collapsed,
  });

  return (
    <div className={rootClassName} ref={rootRef}>
      {collapsed !== null && (
        <>
          <div
            role="button"
            tabIndex={0}
            className={cn(styles.header, headerClassName)}
            onClick={() => setIsShow(!isShow)}
            onKeyDown={() => setIsShow(!isShow)}
          >
            <p className={styles.title}>{shortTitle || title}</p>
            <p className={styles.selectedTitle}>{selectedLabel}</p>
            <Icon className={styles.controlIcon} name="listFilter" />
          </div>
          <RadioGroup
            className={cn(styles.radioGroup, { [styles.show]: isShow })}
            itemClassName={styles.radio}
            activeItemClassName={styles.activeRadio}
            value={(value as unknown as string) || ''}
            onChange={handleChange}
          >
            {children}
          </RadioGroup>
        </>
      )}
    </div>
  );
};
