import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  resetIdCounter,
  Tab,
  TabList,
  TabPanel,
  Tabs as ReactTabs
} from 'react-tabs';

import 'react-tabs/style/react-tabs.css';

// Styles
import styles from './tabs.module.scss';

// Types
import { TabItem } from './types';

export interface TabsProps {
  className?: string;
  tabs: TabItem[];
  fitContent?: boolean;
  isControlled?: boolean;
  renderTabHeader?: (id: string, label?: string | undefined) => void;
  onTabSelect?: (name: string) => void;
}

resetIdCounter();

const Tabs: React.FC<TabsProps> = ({
  tabs,
  className,
  fitContent,
  isControlled = true,
  onTabSelect
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
        if (onTabSelect) {
          const name = tabs[index]?.label;

          onTabSelect(name as string);
        }

        router.push(
          {
            pathname: '',
            query: {
              ...router.query,
              tab: index
            }
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
