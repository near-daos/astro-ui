import React, { FC, useState } from 'react';
import cn from 'classnames';

import { IconButton } from 'components/button/IconButton';
import { GenericDropdown } from 'astro_2.0/components/GenericDropdown';

import { copyToClipboard } from 'utils/copyToClipboard';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Button } from 'components/button/Button';
import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';
import { ProposalType, ProposalVariant } from 'types/proposal';

import { Icon } from 'components/Icon';

import styles from './SocialActions.module.scss';

const defaultTooltipText = 'Copy page URL';

interface Props {
  proposalVariant: ProposalVariant;
  proposalType: ProposalType;
  proposalDescription: string;
  daoId: string;
  proposalId: string | undefined;
}

export const SocialActions: FC<Props> = ({
  proposalId,
  daoId,
  proposalType,
  proposalVariant,
  proposalDescription,
}) => {
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState(defaultTooltipText);

  const shareContent = `${proposalType}:${proposalVariant} \n ${proposalDescription}`;

  const url = SINGLE_PROPOSAL_PAGE_URL.replace('[dao]', daoId).replace(
    '[proposal]',
    proposalId || ''
  );
  const shareUrl = `${document.location?.origin}${url}`;

  return (
    <GenericDropdown
      isOpen={open}
      onOpenUpdate={setOpen}
      parent={
        <div className={styles.root}>
          <IconButton
            icon="reply"
            className={styles.rootIcon}
            // size="large"
          />
        </div>
      }
    >
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Tooltip overlay={<span>{tooltip}</span>} placement="top">
            <Button
              variant="transparent"
              className={styles.buttonContent}
              size="small"
              onClick={async () => {
                await copyToClipboard(shareUrl);

                setTooltip('Copied successfully');

                setTimeout(() => {
                  setTooltip(defaultTooltipText);
                }, 2000);
              }}
            >
              <Icon name="copy" className={styles.icon} />
              <span>Copy link</span>
            </Button>
          </Tooltip>
        </li>
        <li className={cn(styles.menuItem)}>
          <a
            rel="noreferrer"
            target="_blank"
            className="twitter-share-button"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${shareContent}\n${shareUrl} `
            )}`}
          >
            <Icon name="tweet" className={styles.icon} />
            <span>Share on Twitter</span>
          </a>
        </li>
        <li className={cn(styles.menuItem)}>
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://t.me/share/url?url=${encodeURIComponent(
              shareUrl
            )}&text=${shareContent}`}
          >
            <Icon name="telegram" className={styles.icon} />
            <span>Share on Telegram</span>
          </a>
        </li>
      </ul>
    </GenericDropdown>
  );
};
