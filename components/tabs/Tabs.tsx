import cn from 'classnames';
import isNil from 'lodash/isNil';
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

  const [tabIndex, setTabIndex] = useState(0);

  const rootClassName = cn(styles.root, className, {
    [styles.fitContent]: fitContent
  });

  useEffect(() => {
    const queryTabIndex = router.query.tab;

    if (!isNil(queryTabIndex) && +queryTabIndex !== tabIndex) {
      const newTabIndex = +queryTabIndex;

      setTabIndex(newTabIndex);

      if (onTabSelect) {
        const name = tabs[newTabIndex]?.label;

        onTabSelect(name);
      }
    } else if (isNil(queryTabIndex)) {
      setTabIndex(0);
    }
    // eslint-disable-next-line
  }, [router, router.query.tab, tabIndex, onTabSelect]);

  if (isNil(tabIndex)) {
    return null;
  }

  let tabsProps = {};

  if (isControlled) {
    tabsProps = {
      selectedIndex: tabIndex,
      onSelect: (index: number) => {
        if (onTabSelect) {
          const name = tabs[index]?.label;

          onTabSelect(name);
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
