import React, { useState } from 'react';
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
}

resetIdCounter();

const Tabs: React.FC<TabsProps> = ({ tabs, className, fitContent }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const rootClassName = cn(styles.root, className, {
    [styles.fitContent]: fitContent
  });

  return (
    <div className={rootClassName}>
      <ReactTabs
        selectedIndex={tabIndex}
        onSelect={index => setTabIndex(index)}
      >
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
        {tabs.map(item => (
          <TabPanel key={item.id}>{item.content}</TabPanel>
        ))}
      </ReactTabs>
    </div>
  );
};

export default React.memo(Tabs);
