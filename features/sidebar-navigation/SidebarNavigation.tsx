import { useDAOList } from 'hooks/useDAOList';
import React, { FC } from 'react';

import { Sidebar } from 'components/sidebar/Sidebar';
import { useSidebarData } from 'features/sidebar-navigation/helpers';

interface SidebarNavigationProps {
  className?: string;
  fullscreen?: boolean;
  closeSideBar?: () => void;
}

export const SidebarNavigation: FC<SidebarNavigationProps> = ({
  className = '',
  fullscreen = false,
  closeSideBar
}) => {
  const menuItems = useSidebarData();
  const { daos } = useDAOList();

  return (
    <Sidebar
      daoList={daos}
      items={menuItems}
      className={className}
      fullscreen={fullscreen}
      closeSideBar={closeSideBar}
    />
  );
};
