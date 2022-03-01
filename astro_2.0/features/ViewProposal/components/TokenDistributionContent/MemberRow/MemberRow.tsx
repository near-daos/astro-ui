import React, { FC } from 'react';

import { GovernanceToken } from 'types/token';
import { Member } from 'astro_2.0/features/CreateProposal/types';

import styles from './MemberRow.module.scss';

interface MemberRowProps {
  governanceToken: GovernanceToken;
  data: Member;
}

export const MemberRow: FC<MemberRowProps> = ({ governanceToken, data }) => {
  const { name, value } = data;

  return (
    <div className={styles.root}>
      <span className={styles.name}>{name}</span>
      <span className={styles.inputWrapper}>
        <div className={styles.input}>{value}</div>
        <div className={styles.tokenSuffix}>{governanceToken.name}</div>
      </span>
    </div>
  );
};
