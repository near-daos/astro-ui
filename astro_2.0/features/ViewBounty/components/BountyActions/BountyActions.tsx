import React, { FC, useEffect, useState } from 'react';
import { useMedia, useMountedState } from 'react-use';

import { SINGLE_BOUNTY_PAGE_URL } from 'constants/routing';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ActionButton } from 'astro_2.0/components/ActionButton';

import styles from './BountyActions.module.scss';

interface BountyActionsProps {
  description: string;
  daoId: string;
  contextId: string | undefined;
}

export const BountyActions: FC<BountyActionsProps> = ({
  description,
  daoId,
  contextId,
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const isMounted = useMountedState();

  useEffect(() => {
    if (window && isMounted() && !location) {
      setLocation(window.location);
    }
  }, [isMounted, location]);

  const isLargeDesktop = useMedia('(min-width: 1280px)');

  const tooltipPlacement = isLargeDesktop ? 'right' : 'left';

  const url = SINGLE_BOUNTY_PAGE_URL.replace('[dao]', daoId).replace(
    '[bountyContext]',
    contextId || ''
  );
  const shareUrl = `${location?.origin}${url}`;
  const shareContent = `Bounty: \n${description}`;

  return (
    <div
      tabIndex={0}
      role="menu"
      onKeyPress={e => e.stopPropagation()}
      className={styles.root}
      onClick={e => e.stopPropagation()}
    >
      <a
        target="_blank"
        rel="noreferrer"
        className="twitter-share-button"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${shareContent}\n${shareUrl}`
        )}`}
      >
        <ActionButton
          tooltip="Tweet"
          iconName="socialTwitterAlt"
          size="small"
          className={styles.icon}
          tooltipPlacement={tooltipPlacement}
        />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://t.me/share/url?url=${encodeURIComponent(
          shareUrl
        )}&text=${shareContent}`}
      >
        <ActionButton
          tooltip="Telegram"
          iconName="socialTelegram"
          size="small"
          className={styles.icon}
          tooltipPlacement={tooltipPlacement}
        />
      </a>
      <CopyButton
        text={shareUrl}
        tooltipPlacement={tooltipPlacement}
        className={styles.copyBtn}
      />
    </div>
  );
};
