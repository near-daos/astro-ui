import { Button } from 'components/button/Button';

import { Modal, useModal } from 'components/modal';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';
import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import { ProposalButtonContent } from './components/proposal-button-content';

import { ProposalClaimIcon } from './components/ProposalClaimIcon';
import { ProposalRequestPayout } from './components/ProposalRequestPayout';

import styles from './create-proposal-popup.module.scss';

export interface CreateProposalPopupProps {
  isOpen: boolean;
  onClose: (proposalId?: string) => void;
}

export const CreateProposalPopup: FC<CreateProposalPopupProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;

  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup);

  const requestPayoutClickHandler = useCallback(async () => {
    const [proposalId] = await showRequestPayoutPopup();

    onClose(proposalId);
  }, [onClose, showRequestPayoutPopup]);

  const claimBountyClickHandler = useCallback(async () => {
    if (!daoId) return;

    await router.push(`/dao/${daoId}/tasks/bounties`);
    onClose();
  }, [onClose, router, daoId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.root}>
        <h2>Create proposal</h2>
        <p>This will create a new vote for the members of this DAO.</p>
        <Button
          variant="tertiary"
          className={styles.proposal}
          size="block"
          onClick={requestPayoutClickHandler}
        >
          <ProposalButtonContent
            icon={ProposalRequestPayout}
            title="Request a payout"
            description="Completed a task? Request your payout from the DAO."
          />
        </Button>
        <Button
          variant="tertiary"
          className={styles.proposal}
          size="block"
          onClick={claimBountyClickHandler}
        >
          <ProposalButtonContent
            icon={ProposalClaimIcon}
            title="Claim a bounty"
            description="Sign up here to work on a specific bounty."
          />
        </Button>
      </div>
    </Modal>
  );
};
