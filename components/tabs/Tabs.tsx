import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Tab,
  Tabs as ReactTabs,
  TabList,
  TabPanel,
  resetIdCounter
} from 'react-tabs';

import cn from 'classnames';

import 'react-tabs/style/react-tabs.css';

// Types
import { TabItem } from './types';

// Styles
import styles from './tabs.module.scss';

export interface TabsProps {
  className?: string;
  tabs: TabItem[];
  fitContent?: boolean;
  isControlled?: boolean;
}

resetIdCounter();

const Tabs: React.FC<TabsProps> = ({
  tabs,
  className,
  fitContent,
  isControlled = true
}) => {
  const router = useRouter();

  const [tabIndex, setTabIndex] = useState(
    router.query.tab !== undefined ? +router.query?.tab : undefined
  );

  const rootClassName = cn(styles.root, className, {
    [styles.fitContent]: fitContent
  });

  useEffect(() => {
    if (router.query.tab !== undefined && +router.query.tab !== tabIndex) {
      setTabIndex(+router.query.tab);
    } else if (router.query.tab === undefined) {
      setTabIndex(0);
    }
  }, [router, router.query.tab, tabIndex]);

  if (tabIndex === undefined) return null;

  let tabsProps = {};

  if (isControlled) {
    tabsProps = {
      selectedIndex: tabIndex,
      onSelect: (index: number) => {
        router.push(
          {
            pathname: '',
            query: { ...router.query, tab: index }
          },
          undefined,
          { shallow: true }
        );
      }
    };
  }

  return (
    <div className={rootClassName}>
      <ReactTabs {...tabsProps}>
        <div className={styles.tabsWrapper}>
          <TabList className={styles.tabs}>
            {tabs.map(item => (
              <Tab
                key={item.id}
                selectedClassName={styles.active}
                className={styles.tab}
                data-name={item.label}
              >
                {item.label}
              </Tab>
            ))}
          </TabList>
        </div>
        {tabs.map(item => (
          <TabPanel key={item.id}>{item.content}</TabPanel>
        ))}
      </ReactTabs>
    </div>
  );
};

export default React.memo(Tabs);
