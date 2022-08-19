import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Icon, IconName } from 'components/Icon';

import { kFormatter } from 'utils/format';

import styles from './MobileNavItem.module.scss';

interface Props {
  icon: IconName;
  label: string;
  href: string | string[];
  externalLink?: boolean;
  actionsCount?: number;
}

export const MobileNavItem: FC<Props> = ({
  icon,
  label,
  href,
  externalLink,
  actionsCount,
}) => {
  const router = useRouter();
  const links = Array.isArray(href) ? href : [href];
  const link = Array.isArray(href) ? href[0] : href;
  const isActive =
    links.reduce<string[]>((res, item) => {
      if (router.asPath.indexOf(item) !== -1) {
        res.push(item);
      }

      return res;
    }, []).length > 0;
  const iconName = (
    isActive && icon !== 'plus' ? `${icon}Filled` : icon
  ) as IconName;

  const anchorProps = useMemo(() => {
    return externalLink
      ? {
          link,
          target: '_blank',
          rel: 'noreferrer noopener',
        }
      : {};
  }, [externalLink, link]);

  const content = (
    <a
      className={cn(styles.root, {
        [styles.active]: isActive,
      })}
      {...anchorProps}
    >
      <div className={cn(styles.iconWrapper)}>
        <Icon name={iconName} className={cn(styles.icon)} />
        {!!actionsCount && (
          <div className={styles.actionsCount}>
            {kFormatter(actionsCount ?? 0)}
          </div>
        )}
      </div>
      <div className={styles.label}>{label}</div>
    </a>
  );

  if (externalLink) {
    return content;
  }

  return (
    <Link href={{ pathname: link }} shallow>
      {content}
    </Link>
  );
};
