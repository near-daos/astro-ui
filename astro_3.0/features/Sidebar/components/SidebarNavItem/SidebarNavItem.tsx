import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Icon, IconName } from 'components/Icon';

import styles from './SidebarNavItem.module.scss';

interface Props {
  icon: IconName;
  label: string;
  href: string | string[];
  externalLink?: boolean;
}

export const SidebarNavItem: FC<Props> = ({
  icon,
  label,
  href,
  externalLink,
}) => {
  const router = useRouter();
  const link = Array.isArray(href) ? href[0] : href;

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
        [styles.active]: router.asPath.indexOf(link) !== -1,
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
        <Icon name={icon} className={cn(styles.icon)} />
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
