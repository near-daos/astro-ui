import React, { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useClickAway } from 'react-use';

import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { Proposal } from 'types/proposal';

import styles from './proposal-actions.module.scss';

interface MobileProposalActionsProps {
  proposal: Proposal;
}

export const MobileProposalActions: FC<MobileProposalActionsProps> = ({
  proposal,
}) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    setLocation(document.location);
  }, []);

  useClickAway(ref, () => {
    setOpen(false);
  });

  if (!proposal) {
    return null;
  }

  const shareContent = encodeURIComponent(
    `${proposal.proposalVariant} \n ${proposal.description}`
  );
  const shareUrl = `${location?.origin}/dao/${proposal.daoId}/proposals/${proposal.id}`;

  return (
    <div className={styles.mobileRoot} ref={ref}>
      <IconButton
        icon="buttonMore"
        size="medium"
        className={cn({
          [styles.open]: open,
        })}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className={styles.options}>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="buttonShare" width={20} /> Share
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <a
              className="twitter-share-button"
              href={`https://twitter.com/intent/tweet?text=${shareContent}`}
            >
              <Icon name="socialTwitter" width={20} />
            </a>
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                shareUrl
              )}&text=${shareContent}`}
            >
              <Icon name="socialTelegram" width={20} />
            </a>
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="buttonCopy" width={20} /> Copy link
          </Button>
          <Button variant="tertiary" className={styles.button}>
            <Icon name="buttonReport" width={20} /> Report
          </Button>
        </div>
      )}
    </div>
  );
};
