import React, { FC } from 'react';
import cn from 'classnames';

import { ProposalType } from 'types/proposal';
import StatusPanel from 'components/cards/proposal-card/components/proposal-status-panel/ProposalStatusPanel';

import styles from './plugin-card.module.scss';

export interface PluginCardProps {
  tokenName: string;
  created: string;
  functionName: string;
}

export const PluginCard: FC<PluginCardProps> = ({
  tokenName,
  created,
  functionName
}) => {
  return (
    <div className={cn(styles.root)}>
      <StatusPanel
        type={ProposalType.FunctionCall}
        status="Approved"
        variant="Default"
      />
      <div className={styles.content}>
        <div className={styles.token}>{tokenName}</div>
        <div className={styles.created}>{created}</div>
        <div className={styles.function}>{functionName}</div>
      </div>
    </div>
  );
};
