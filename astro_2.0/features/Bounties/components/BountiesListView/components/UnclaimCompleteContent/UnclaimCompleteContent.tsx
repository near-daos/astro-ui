import React, { FC } from 'react';
import cn from 'classnames';

import { Button } from 'components/button/Button';

import { useBountyControls } from 'astro_2.0/features/Bounties/components/hooks';

import { DAO } from 'types/dao';
import { Bounty } from 'types/bounties';
import { ProposalVariant } from 'types/proposal';

import styles from './UnclaimCompleteContent.module.scss';

interface UnclaimCompleteContentProps {
  dao: DAO;
  bounty: Bounty;
  className?: string;
  completeHandler?: (
    id: number,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
}

export const UnclaimCompleteContent: FC<UnclaimCompleteContentProps> = ({
  dao,
  bounty,
  className,
  completeHandler,
}) => {
  const { handleUnclaim } = useBountyControls(dao.id, bounty);

  return (
    <div className={cn(styles.root, className)}>
      <Button
        variant="secondary"
        size="small"
        type="submit"
        data-testid="ucc-unclaim"
        onClick={() => handleUnclaim()}
        className={cn(styles.unclaim, styles.button)}
      >
        Unclaim
      </Button>

      <Button
        variant="black"
        size="small"
        data-testid="ucc-complete"
        onClick={() => {
          if (completeHandler) {
            completeHandler(bounty.bountyId, ProposalVariant.ProposeDoneBounty);
          }
        }}
        className={cn(styles.complete, styles.button)}
      >
        Complete
      </Button>
    </div>
  );
};
