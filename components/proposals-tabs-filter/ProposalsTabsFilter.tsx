import React, { FC, ReactNode } from 'react';
import Tabs from 'components/tabs/Tabs';
import { Proposal } from 'types/proposal';

interface TabConfig {
  label: string;
  className: string;
}

interface ProposalsTabsFilterProps<T> {
  proposals: T[];
  tabContentRenderer: (proposals: T[]) => ReactNode;
  tabsConfig: TabConfig[];
  filter: (proposals: T[]) => T[][];
}

export const ProposalsTabsFilter: FC<ProposalsTabsFilterProps<Proposal>> = ({
  proposals,
  tabContentRenderer,
  tabsConfig,
  filter,
  children
}) => {
  const filteredData = filter(proposals);

  const tabs = tabsConfig.map((item, i) => ({
    ...item,
    id: i,
    content: tabContentRenderer(filteredData[i])
  }));

  return (
    <div>
      <Tabs tabs={tabs} skipShallow>
        {children}
      </Tabs>
    </div>
  );
};
