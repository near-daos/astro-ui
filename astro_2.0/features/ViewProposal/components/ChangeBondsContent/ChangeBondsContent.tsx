import React, { FC } from 'react';

import { DAO } from 'types/dao';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './ChangeBondsContent.module.scss';

interface ChangeBondsContentProps {
  dao: DAO;
  createProposalBond: number;
  proposalExpireTime: number;
  claimBountyBond: number;
  unclaimBountyTime: number;
}

export const ChangeBondsContent: FC<ChangeBondsContentProps> = ({
  dao,
  createProposalBond,
  proposalExpireTime,
  claimBountyBond,
  unclaimBountyTime,
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.title}>Proposals</div>
        <div className={styles.inline}>
          <FieldWrapper label="Bonds to create proposals">
            <FieldValue value={createProposalBond} />
          </FieldWrapper>

          <FieldWrapper label="Time before proposals expire">
            <FieldValue value={proposalExpireTime} />
          </FieldWrapper>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Bounties</div>
        <div className={styles.inline}>
          <FieldWrapper label="Bonds to claim bounty">
            <FieldValue value={claimBountyBond} />
          </FieldWrapper>

          <FieldWrapper label="Time to unclaim a bounty without penalty">
            <FieldValue value={unclaimBountyTime} />
          </FieldWrapper>
        </div>
      </div>

      <div className={styles.row}>
        <InfoBlockWidget label="Target" value={dao.id} valueFontSize="S" />
      </div>
    </div>
  );
};
