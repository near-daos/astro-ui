import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import styles from './UpdateVotePolicyToWeightVoting.module.scss';

interface Props {
  balance: string;
  quorum: string;
  threshold: string;
}

export const UpdateVotePolicyToWeightVoting: FC<Props> = ({
  balance,
  quorum,
  threshold,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <FieldWrapper label="Balance (minimum amount of tokens delegated to user to vote in DAO)">
        <FieldValue value={balance} />
      </FieldWrapper>
      <FieldWrapper
        label={`${t(
          'threshold'
        )} (minimum amount of tokens needed to approve/reject proposal)`}
      >
        <FieldValue value={threshold} />
      </FieldWrapper>
      <FieldWrapper label="Quorum (minimum amount of tokens required to approve/reject proposal)">
        <FieldValue value={quorum} />
      </FieldWrapper>
    </div>
  );
};
