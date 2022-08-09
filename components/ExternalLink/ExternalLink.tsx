import cn from 'classnames';
import { useMount } from 'react-use';
import React, { FC, MouseEvent, useState } from 'react';
import { composeProperLinkUrl } from 'utils/composeProperLinkUrl';

import { Icon, IconName } from 'components/Icon';

import styles from './ExternalLink.module.scss';

interface ExternalLinkProps {
  to: string;
  icon?: IconName;
  linkClassName?: string;
  iconClassName?: string;
  hideLinkLable?: boolean;
}

export const ExternalLink: FC<ExternalLinkProps> = ({
  to,
  icon,
  linkClassName,
  hideLinkLable,
  iconClassName,
}) => {
  const [linkTitle, setLinkTitle] = useState('');

  const link = composeProperLinkUrl(to);

  useMount(() => {
    try {
      const { hostname } = new URL(link ?? '');

      setLinkTitle(hostname);
    } catch (e) {
      // do nothing
    }
  });

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  if (!to || !linkTitle) {
    return null;
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      onClick={stopPropagation}
      className={cn('caption1', styles.root)}
    >
      <Icon
        name={icon || 'buttonExternal'}
        width={20}
        className={cn(styles.icon, iconClassName)}
      />
      {!hideLinkLable && (
        <span className={cn('body2', styles.text, linkClassName)}>
          {linkTitle}
        </span>
      )}
    </a>
  );
};
