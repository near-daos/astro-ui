import { Icon } from 'components/Icon';
import { Modal } from 'components/modal';
import {
  IRequestPayoutForm,
  RequestPayoutForm
} from 'features/treasury/request-payout-popup/components/RequestPayoutForm';
import { useDao } from 'hooks/useDao';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import { SputnikService, yoktoNear } from 'services/SputnikService';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';
import { TokenType } from 'types/token';
import { FUNGIBLE_TOKEN } from 'features/types';

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
  const [tokens, setTokens] = useState<TokenType[]>([]);

  useEffect(() => {
    SputnikService.getAllTokens().then(setTokens);
  }, []);

  const daoId = router.query.dao as string;
  const currentDao = useDao(daoId);

  const handleSubmit = useCallback(
    async (data: IRequestPayoutForm) => {
      if (currentDao) {
        const getTokenDecimals = () => {
          if (data.token === FUNGIBLE_TOKEN && data.tokenAddress) {
            const tokenSymbol = data.tokenAddress.split('.')[0];
            const ft = tokens.find(token => token.symbol === tokenSymbol);

            return ft ? 10 ** ft.decimals : yoktoNear;
          }

          return yoktoNear;
        };

        await SputnikService.createProposal({
          daoId: currentDao.id,
          description: `${data.detail}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`,
          kind: 'Transfer',
          bond: currentDao.policy.proposalBond,
          data: {
            token_id:
              data.token === FUNGIBLE_TOKEN && data.tokenAddress
                ? data.tokenAddress
                : '',
            receiver_id: data.recipient,
            amount: new Decimal(data.amount).mul(getTokenDecimals()).toFixed()
          }
        });

        onClose();

        // Reload page to force call of the getServerSideProps of page
        router.replace(router.asPath);
      }
    },
    [tokens, router, onClose, currentDao]
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
