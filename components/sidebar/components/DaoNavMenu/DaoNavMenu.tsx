import get from 'lodash/get';
import Link from 'next/link';
import React, { FC } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';

import { NavItem } from 'components/nav-item/NavItem';
import { NavSubItem } from 'components/nav-item/NavSubItem';
import { Collapsable } from 'components/collapsable/Collapsable';
import { ImageWithFallback } from 'components/image-with-fallback';
import { useGetDaoNavItems } from 'components/sidebar/components/DaoNavMenu/helpers';

import { useDao } from 'hooks/useDao';
import { useAccordion } from 'hooks/useAccordion';

import styles from './DaoNavMenu.module.scss';

export const DaoNavMenu: FC = () => {
  const router = useRouter();
  const items = useGetDaoNavItems();

  const daoId = router.query.dao as string;

  const dao = useDao(daoId);

  const activeGroupId = get(router.asPath.split('/'), 3);

  const { getItemProps } = useAccordion({
    allowUnSelect: true,
    allowMultiSelect: false,
    preSelected: (() => {
      if (activeGroupId === 'dao') return [];

      return isEmpty(activeGroupId) ? [] : [activeGroupId];
    })()
  });

  if (!dao) {
    return null;
  }

  function renderSelectedDaoAdditionalPages() {
    return (
      <nav className={styles.menu}>
        {items.map(item => {
          if (isEmpty(item.subItems)) {
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
                  active={activeGroupId === item.id}
                />
              )}
            >
              {item.subItems.map(subItem => (
                <NavSubItem
                  key={subItem.id}
                  count={subItem.count}
                  label={subItem.label}
                  href={subItem.href}
                  as={subItem.as}
                  disabled={subItem.disabled}
                  urlParams={{ dao: dao?.id }}
                  subHrefs={subItem.subHrefs}
                />
              ))}
            </Collapsable>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <div className={styles.delimiter} />
      <div className={styles.navItems}>
        <Link passHref href={`/dao/${dao.id}`}>
          <div className={styles.selectedDao}>
            <div className={styles.daoLogo}>
              <ImageWithFallback
                fallbackSrc="/flag.svg"
                loading="eager"
                src={dao?.logo || '/flag.svg'}
                width={70}
                height={70}
                alt="Dao Logo"
              />
            </div>
            {dao.name}
          </div>
        </Link>
        {renderSelectedDaoAdditionalPages()}
      </div>
      <div className={styles.delimiter} />
    </>
  );
};
