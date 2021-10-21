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
import { SputnikService } from 'services/SputnikService';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import { useCustomTokensContext } from 'context/CustomTokensContext';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';
import { VoteDetails } from 'components/vote-details';

import styles from './request-payout-popup.module.scss';

export interface RequestPayoutPopupProps {
  type: 'send' | 'request';
  isOpen: boolean;
  onClose: (created?: boolean) => void;
}

export const RequestPayoutPopup: React.FC<RequestPayoutPopupProps> = ({
  type,
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const { tokens } = useCustomTokensContext();

  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(
    async (data: IRequestPayoutForm) => {
      if (currentDao) {
        const token = tokens[data.tokenSymbol];

        await SputnikService.createProposal({
          daoId: currentDao.id,
          description: `${data.detail}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
          kind: 'Transfer',
          bond: currentDao.policy.proposalBond,
          data: {
            token_id: token.tokenId,
            receiver_id: data.recipient,
            amount: new Decimal(data.amount).mul(10 ** token.decimals).toFixed()
          }
        });

        showNotification({
          type: NOTIFICATION_TYPES.INFO,
          description: `The blockchain transactions might take some time to perform, please visit DAO details page in few seconds`,
          lifetime: 20000
        });

        onClose(true);
      }
    },
    [tokens, onClose, currentDao]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <Icon
          name={type === 'send' ? 'proposalReceivedFunds' : 'proposalSendFunds'}
          width={24}
        />
        <h2>Propose transfer</h2>
      </header>
      <div className={styles.policyWrapper}>
        <VoteDetails scope="transfer" showBond={false} />
      </div>
      <div className={styles.content}>
        <RequestPayoutForm
          onCancel={onClose}
          onSubmit={handleSubmit}
          initialValues={{ tokenSymbol: 'NEAR' }}
          tokens={tokens}
          bond={currentDao?.policy.proposalBond}
        />
      </div>
    </Modal>
  );
};
