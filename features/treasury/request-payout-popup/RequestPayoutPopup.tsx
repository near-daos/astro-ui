import { Modal } from 'components/modal';
import { Icon } from 'components/Icon';
import React from 'react';
import { RequestPayoutForm } from 'features/treasury/request-payout-popup/components/RequestPayoutForm';
import styles from './request-payout-popup.module.scss';

export interface RequestPayoutPopupProps {
  type: 'send' | 'request';
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
}

export const RequestPayoutPopup: React.FC<RequestPayoutPopupProps> = ({
  type,
  isOpen,
  onClose
}) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSubmit = () => {};

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
        <RequestPayoutForm onCancel={onClose} onSubmit={handleSubmit} />
      </div>
    </Modal>
  );
};
