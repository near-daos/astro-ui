import React from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';

import styles from './breadcrumbs.module.scss';

export interface BreadCrumbsProps {
  className?: string;
  children: React.ReactElement[];
  separator?: IconName;
  linkClassName?: string;
  activeLinkClassName?: string;
}

export const BreadCrumbs: React.VFC<BreadCrumbsProps> = ({
  className,
  children,
  separator = 'buttonArrowRight',
  linkClassName = styles.link,
  activeLinkClassName = styles.activeLink,
}) => {
  return (
    <nav className={cn(styles.root, className)}>
      <ol className={styles.list}>
        {React.Children.map(children, (child, index) => [
          <li className={styles.item}>
            {React.cloneElement(child, {
              className: cn(child.props.className, linkClassName, {
                [activeLinkClassName]: index === children.length - 1,
              }),
            })}
          </li>,
          index !== children.length - 1 && (
            <li className={styles.item}>
              <Icon name={separator} width={16} />
            </li>
          ),
        ])}
      </ol>
    </nav>
  );
};
