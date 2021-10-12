import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';
import {
  IRequestPayoutForm,
  RequestPayoutForm
} from 'features/treasury/request-payout-popup/components/RequestPayoutForm';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import Decimal from 'decimal.js';
import { SputnikService, yoktoNear } from 'services/SputnikService';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import styles from './request-payout-popup.module.scss';

export interface RequestPayoutPopupProps {
  type: 'send' | 'request';
  isOpen: boolean;
  onClose: (proposalId?: string) => void;
}

export const RequestPayoutPopup: React.FC<RequestPayoutPopupProps> = ({
  type,
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(
    async (data: IRequestPayoutForm) => {
      if (currentDao) {
        await SputnikService.createProposal({
          daoId: currentDao.id,
          description: `${data.detail}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
          kind: 'Transfer',
          bond: currentDao.policy.proposalBond,
          data: {
            token_id:
              data.token === 'Fungible Token' && data.tokenAddress
                ? data.tokenAddress
                : '',
            receiver_id: data.recipient,
            amount: new Decimal(data.amount).mul(yoktoNear).toFixed()
          }
        });

        onClose();

        // Reload page to force call of the getServerSideProps of page
        router.replace(router.asPath);
      }
    },
    [router, onClose, currentDao]
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
