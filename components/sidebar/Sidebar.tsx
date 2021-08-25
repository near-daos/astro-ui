import React, { ReactNode } from 'react';
import { useAccordion } from 'hooks/useAccordion';
import { Logo } from 'components/logo/Logo';
import { DaoList } from 'components/nav-dao/DaoList';
import { Collapsable } from 'components/collapsable/Collapsable';
import { NavItem } from 'components/nav-item/NavItem';
import { NavSubItem } from 'components/nav-item/NavSubItem';
import styles from 'components/sidebar/sidebar.module.scss';
import { IconName } from 'components/Icon';

interface ItemBase {
  id: string;
  label: string | ReactNode;
  href: string;
  count?: number;
}

interface MenuItem extends ItemBase {
  subItems: ItemBase[];
  logo: IconName;
}

interface SidebarProps {
  daoList: React.ComponentProps<typeof DaoList>['items'];
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ daoList, items }) => {
  const { getItemProps } = useAccordion({
    allowUnSelect: true,
    allowMultiSelect: false
  });

  return (
    <aside className={styles.sidebar}>
      <div className={styles.wrapper}>
        <Logo />
        <DaoList {...getItemProps('dao')} items={daoList} />

        <nav className={styles.menu}>
          {items.map(item => {
            if (!item.subItems?.length) {
              return (
                <NavItem
                  key={item.id}
                  className={styles.item}
                  label={item.label}
                  count={item.count}
                  href={item.href}
                  icon={item.logo}
                />
              );
            }

            return (
              <Collapsable
                {...getItemProps(item.id)}
                key={item.id}
                duration={250}
                renderHeading={toggle => (
                  <NavItem
                    onClick={() => toggle()}
                    className={styles.item}
                    label={item.label}
                    count={item.count}
                    href={item.href}
                    icon={item.logo}
                  />
                )}
              >
                {item.subItems.map(subItem => (
                  <NavSubItem
                    key={subItem.id}
                    count={subItem.count}
                    label={subItem.label}
                    href={subItem.href}
                  />
                ))}
              </Collapsable>
            );
          })}
        </nav>

        <nav className={styles.bottom}>
          <NavItem
            className={styles.item}
            label="Home"
            count={999}
            href="#"
            icon="stateHome"
          />
          <NavItem
            className={styles.item}
            label="All Communities"
            href="#"
            icon="stateCommunities"
          />
          <NavItem
            className={styles.item}
            label="Create a DAO"
            href="#"
            icon="stateCreateDao"
          />
        </nav>
      </div>
    </aside>
  );
};
