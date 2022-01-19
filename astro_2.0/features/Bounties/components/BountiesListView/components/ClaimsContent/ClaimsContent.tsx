import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import cn from 'classnames';

import { SputnikNearService } from 'services/sputnik';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

import { Button } from 'components/button/Button';

import { ProposalVariant } from 'types/proposal';
import { Bounty } from 'types/bounties';
import { DAO } from 'types/dao';

import styles from './ClaimsContent.module.scss';

interface ClaimsContentProps {
  slots: number;
  slotsTotal: number;
  dao: DAO;
  bounty: Bounty & { status: string };
  accountId: string;
  completeHandler: (
    id: string,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
}

export const ClaimsContent: FC<ClaimsContentProps> = ({
  dao,
  bounty,
  slots,
  slotsTotal,
  accountId,
  completeHandler,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const onSuccessHandler = useCallback(async () => {
    await router.replace(router.asPath);
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      lifetime: 20000,
      description: t('bountiesPage.successClaimBountyNotification'),
    });
  }, [t, router]);

  const claimedBy = bounty.bountyClaims.map(
    ({ accountId: claimedAccount }) => claimedAccount
  );

  const handleClaim = useCallback(async () => {
    await SputnikNearService.claimBounty(dao.id, {
      bountyId: Number(bounty.id),
      deadline: bounty.maxDeadline,
      bountyBond: dao.policy.bountyBond,
    });

    onSuccessHandler();
  }, [bounty, dao.policy.bountyBond, dao.id, onSuccessHandler]);

  const handleUnclaim = useCallback(async () => {
    await SputnikNearService.unclaimBounty(dao.id, bounty.id);
    onSuccessHandler();
  }, [bounty.id, dao.id, onSuccessHandler]);

  function renderButtons() {
    if (bounty.status === 'Available') {
      if (!claimedBy.includes(accountId)) {
        return (
          <div className={styles.buttonsWrapper}>
            <Button
              variant="black"
              size="small"
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

    return (
      <div className={styles.buttonsWrapper}>
        <Button
          variant="secondary"
          size="small"
          type="submit"
          onClick={() => handleUnclaim()}
          className={cn(styles.unclaim, styles.button)}
        >
          Unclaim
        </Button>

        <Button
          variant="black"
          size="small"
          onClick={() =>
            completeHandler(bounty.id, ProposalVariant.ProposeDoneBounty)
          }
          className={cn(styles.complete, styles.button)}
        >
          Complete
        </Button>
      </div>
    );
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
