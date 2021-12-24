import { useMedia, useMountedState } from 'react-use';
import React, { FC, useEffect, useState } from 'react';
import cn from 'classnames';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { ProposalType, ProposalVariant } from 'types/proposal';

import { CopyButton } from 'astro_2.0/components/CopyButton';
import { ActionButton } from 'features/proposal/components/action-button';

import styles from './ProposalActions.module.scss';

interface ProposalActionsProps {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  removeCount: number;
  removed: boolean;
  proposalVariant: ProposalVariant;
  proposalType: ProposalType;
  proposalDescription: string;
  daoId: string;
  proposalId: string | undefined;
}

export const ProposalActions: FC<ProposalActionsProps> = ({
  onRemove,
  removeCount,
  removed,
  proposalVariant,
  proposalType,
  proposalDescription,
  daoId,
  proposalId,
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const isMounted = useMountedState();

  useEffect(() => {
    if (isMounted()) {
      setLocation(document.location);
    }
  }, [isMounted]);

  const isLargeDesktop = useMedia('(min-width: 1280px)');

  const tooltipPlacement = isLargeDesktop ? 'right' : 'left';

  const shareContent = `${proposalType}:${proposalVariant} \n ${proposalDescription}`;

  const url = SINGLE_PROPOSAL_PAGE_URL.replace('[dao]', daoId).replace(
    '[proposal]',
    proposalId || ''
  );
  const shareUrl = `${location?.origin}${url}`;

  return (
    <div className={styles.root}>
      <ActionButton
        tooltip={`Remove: ${removeCount}`}
        onClick={removed ? undefined : onRemove}
        iconName="buttonDelete"
        size="small"
        className={cn(styles.icon, { [styles.inactive]: removed })}
        tooltipPlacement={tooltipPlacement}
      />
      <a
        className="twitter-share-button"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareContent
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
        text={location?.href ?? ''}
        tooltipPlacement={tooltipPlacement}
        className={styles.copyBtn}
      />
    </div>
  );
};
