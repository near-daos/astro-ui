import { Modal } from 'components/modal';
import { Icon } from 'components/Icon';
import React, { useCallback } from 'react';
import { RequestPayoutForm } from 'features/treasury/request-payout-popup/components/RequestPayoutForm';
import { BondDetail, VoteDetail } from 'features/types';
import { SputnikService } from 'services/SputnikService';
import { useSelectedDAO } from 'hooks/useSelectedDao';
import styles from './request-payout-popup.module.scss';

export interface RequestPayoutPopupProps {
  type: 'send' | 'request';
  voteDetails: VoteDetail[];
  bondDetail: BondDetail;
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const RequestPayoutPopup: React.FC<RequestPayoutPopupProps> = ({
  type,
  isOpen,
  onClose
}) => {
  const selectedDao = useSelectedDAO();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSubmit = useCallback(
    data => {
      if (selectedDao) {
        SputnikService.createProposal({
          daoId: selectedDao.id,
          description: data.detail,
          kind: 'Transfer',
          bond: selectedDao.policy.proposalBond,
          data: {
            token_id: '',
            receiver_id: data.recipient,
            amount: data.amount
          }
        }).then(() => {
          onClose();
        });
      }
    },
    [onClose, selectedDao]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon
          name={type === 'send' ? 'proposalReceivedFunds' : 'proposalSendFunds'}
          width={24}
        />
        <h2>{type === 'send' ? 'Send tokens' : 'Request tokens'}</h2>
      </header>
      <div className={styles.content}>
        <RequestPayoutForm
          onCancel={onClose}
          onSubmit={handleSubmit}
          initialValues={{ token: 'NEAR' }}
        />
      </div>
    </Modal>
  );
};
