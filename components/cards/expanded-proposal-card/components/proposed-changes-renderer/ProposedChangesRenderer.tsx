import React, { FC, useState } from 'react';
import { Proposal, ProposalType } from 'types/proposal';
import { DAO } from 'types/dao';
import { getInitialData } from 'features/vote-policy/helpers';

import styles from './proposed-changes-renderer.module.scss';

interface ProposedChangesRendererProps {
  dao: DAO | null;
  proposal: Proposal;
  inline?: boolean;
}

export const ProposedChangesRenderer: FC<ProposedChangesRendererProps> = ({
  inline = false,
  dao,
  proposal,
}) => {
  const [data] = useState(dao ? getInitialData(dao) : undefined);

  if (!data) return null;

  const kind = (proposal?.kind as unknown) as {
    type: ProposalType.ChangePolicy;
    policy: {
      defaultVotePolicy: { weightKind: 'RoleWeight'; threshold: number[] };
    };
  };
  const newPolicy = kind.policy.defaultVotePolicy;

  const voteBy = newPolicy.weightKind === 'RoleWeight' ? 'Person' : 'Token';
  const amount =
    newPolicy?.threshold && Array.isArray(newPolicy?.threshold)
      ? (newPolicy.threshold[0] / newPolicy.threshold[1]) * 100
      : '';
  const threshold = '% of group';

  return (
    <div>
      {!inline && <div className={styles.title}>Proposed changes:</div>}
      <div className={styles.policyWrapper}>
        <div className={styles.policyLabel}>
          Set new voting policy defaults as
        </div>
        <div className={styles.policy}>
          <div>{voteBy}</div>
          <div className={styles.bold}>{amount}</div>
          <div>{threshold}</div>
          <div>to pass</div>
        </div>
      </div>
    </div>
  );
};
