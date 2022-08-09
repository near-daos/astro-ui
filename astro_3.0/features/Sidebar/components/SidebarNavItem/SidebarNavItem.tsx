import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Icon, IconName } from 'components/Icon';

import { kFormatter } from 'utils/format';

import styles from './SidebarNavItem.module.scss';

interface Props {
  icon: IconName;
  label: string;
  href: string | string[];
  externalLink?: boolean;
  actionsCount?: number;
}

export const SidebarNavItem: FC<Props> = ({
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
  const iconName = (isActive ? `${icon}Filled` : icon) as IconName;

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
      <div
        className={cn(styles.iconWrapper)}
        data-tip={label}
        data-place="right"
        data-offset="{ 'right': 10 }"
        data-delay-show="700"
      >
        <Icon name={iconName} className={cn(styles.icon)} />
        {!!actionsCount && (
          <div className={styles.actionsCount}>
            {kFormatter(actionsCount ?? 0)}
          </div>
        )}
      </div>
      <div className={styles.label} data-expanded="hidden" data-value={label} />
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
