import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

// Components
import { Tab } from './Tab';

// Types
import { TabItem } from './types';

// Styles
import styles from './tabs.module.scss';

export interface TabsProps {
  className?: string;
  tabs: TabItem[];
  variant: 'regular' | 'wrapped';
  fitContent?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  className,
  variant = 'regular',
  fitContent
}) => {
  const rootRef = useRef(null);
  const activeTabRef = useRef(null);

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [activeLineStyles, setActiveLineStyles] = useState({
    left: 0,
    width: 0
  });

  useEffect(() => {
    const activeEl = activeTabRef.current;
    const rootEl = rootRef.current;

    if (activeEl && rootEl) {
      const {
        left: rootLeft
      } = (rootEl as HTMLElement).getBoundingClientRect();
      const {
        left: activeLeft,
        width
      } = (activeEl as HTMLElement).getBoundingClientRect();

      setActiveLineStyles({
        left: activeLeft - rootLeft - (variant === 'wrapped' ? 12 : 0),
        width
      });
    }
  }, [activeTab, variant]);

  const rootClassName = cn(styles.root, className, {
    [styles['fit-content']]: fitContent,
    [styles.wrapped]: variant === 'wrapped'
  });

  return (
    <div className={rootClassName} ref={rootRef}>
      <div
        className={cn(styles.tabs, {
          [styles.regular]: variant === 'regular'
        })}
      >
        {tabs.map(tab => {
          const { id } = tab;
          const isActive = activeTab.id === id;

          const el = (
            <Tab key={id} tab={tab} onClick={setActiveTab} active={isActive} />
          );

          return isActive ? React.cloneElement(el, { ref: activeTabRef }) : el;
        })}
        <span className={styles['active-line']} style={activeLineStyles} />
      </div>
      <div className={styles.content}>{activeTab.content}</div>
    </div>
  );
};

export default Tabs;
