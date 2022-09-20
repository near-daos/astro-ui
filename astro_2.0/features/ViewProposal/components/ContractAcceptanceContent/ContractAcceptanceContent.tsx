// TODO requires localisation

import get from 'lodash/get';
import Decimal from 'decimal.js';
import React, { FC } from 'react';

import { ProposalFeedItem } from 'types/proposal';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';

import { fromBase64ToObj } from 'utils/fromBase64ToObj';

import styles from './ContractAcceptanceContent.module.scss';

interface ContractAcceptanceContentProps {
  proposal: ProposalFeedItem;
}

export const ContractAcceptanceContent: FC<ContractAcceptanceContentProps> = ({
  proposal,
}) => {
  const base64 = get(proposal, 'kind.actions.0.args');

  if (!base64) {
    return null;
  }

  const { args } = fromBase64ToObj(base64);

  // eslint-disable-next-line
  const data: { token_id: string; unstake_period: string } =
    fromBase64ToObj(args);
  const { token_id: tokenId, unstake_period: unstakingPeriod } = data;
  const uPeriod = new Decimal(unstakingPeriod).div('3.6e12').toString();

  return (
    <div className={styles.root}>
      <InfoBlockWidget
        label="Token ID"
        value={tokenId}
        className={styles.row}
      />
      <InfoBlockWidget label="Unstaking Period" value={`${uPeriod} hours`} />
    </div>
  );
};
