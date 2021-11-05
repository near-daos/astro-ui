import React, { FC } from 'react';

import { Sidebar } from 'components/sidebar/Sidebar';

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
  return (
    <Sidebar
      className={className}
      fullscreen={fullscreen}
      closeSideBar={closeSideBar}
    />
  );
};
