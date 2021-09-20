import React, { FC, useCallback } from 'react';

import { useModal, Modal } from 'components/modal';

import { Button } from 'components/button/Button';
import { useRouter } from 'next/router';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import { RequestPayoutPopup } from 'features/treasury/request-payout-popup';

import { ProposalClaimIcon } from './components/ProposalClaimIcon';
import { ProposalRequestPayout } from './components/ProposalRequestPayout';
import { ProposalButtonContent } from './components/proposal-button-content';

import styles from './create-proposal-popup.module.scss';

export interface CreateProposalPopupProps {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const CreateProposalPopup: FC<CreateProposalPopupProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const selectedDao = useSelectedDAO();

  const [showRequestPayoutPopup] = useModal(RequestPayoutPopup);

  const requestPayoutClickHandler = useCallback(async () => {
    await showRequestPayoutPopup();
    onClose('submitted');
  }, [onClose, showRequestPayoutPopup]);

  const claimBountyClickHandler = useCallback(async () => {
    if (!selectedDao) {
      return;
    }

    await router.push(`/dao/${selectedDao.id}/tasks/bounties`);
    onClose('submitted');
  }, [onClose, router, selectedDao]);

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
