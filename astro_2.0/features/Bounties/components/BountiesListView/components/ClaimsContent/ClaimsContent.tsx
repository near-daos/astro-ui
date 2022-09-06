import React, { FC } from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';

import { Bounty } from 'types/bounties';
import { DAO } from 'types/dao';

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';

import styles from './ClaimsContent.module.scss';

interface ClaimsContentProps {
  slots: number;
  slotsTotal: number;
  dao: DAO;
  bounty: Bounty;
  accountId: string;
}

export const ClaimsContent: FC<ClaimsContentProps> = ({
  dao,
  bounty,
  slots,
  slotsTotal,
  accountId,
}) => {
  const { handleClaim } = useBountyControls(dao.id, bounty);

  const claimedBy = bounty.bountyClaims.map(
    ({ accountId: claimedAccount }) => claimedAccount
  );

  function renderButtons() {
    if (bounty.bountyClaims.length < Number(bounty.times)) {
      if (!claimedBy.includes(accountId)) {
        return (
          <div className={styles.buttonsWrapper}>
            <Button
              variant="black"
              size="medium"
              type="submit"
              onClick={() => handleClaim()}
              className={cn(styles.claim, styles.button)}
            >
              Claim
            </Button>
          </div>
        );
      }

      return <div className={styles.stub} />;
    }

    return null;
  }

  return (
    <div className={styles.root}>
      <span className={styles.slotsWrapper}>
        <span className={styles.slotActive}>{slots}</span>
        <span className={styles.slot}> / {slotsTotal}</span>
      </span>
      {renderButtons()}
    </div>
  );
};
