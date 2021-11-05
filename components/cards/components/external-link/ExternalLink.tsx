import cn from 'classnames';
import { useMount } from 'react-use';
import React, { FC, MouseEvent, useState } from 'react';
import { composeProperLinkUrl } from 'helpers/composeProperLinkUrl';

import { Icon } from 'components/Icon';

import styles from './external-link.module.scss';

interface ExternalLinkProps {
  to: string;
}

const ExternalLink: FC<ExternalLinkProps> = ({ to }) => {
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

  if (!to) {
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
      <Icon name="buttonExternal" width={14} />
      &nbsp;
      <span className={cn('caption1', styles.text)}>{linkTitle}</span>
    </a>
  );
};

export default ExternalLink;
