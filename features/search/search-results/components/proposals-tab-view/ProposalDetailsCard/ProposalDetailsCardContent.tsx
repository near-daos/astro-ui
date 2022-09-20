import React, { FC, useCallback } from 'react';

import { useRouter } from 'next/router';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { ProposalDetails } from 'types/proposal';

import styles from './ProposalDetailsCard.module.scss';

interface Props {
  data: ProposalDetails;
}

export const ProposalDetailsCardContent: FC<Props> = ({ data }) => {
  const router = useRouter();

  const { id, daoId, status, description } = data;

  const handleCardClick = useCallback(async () => {
    await router.push({
      pathname: SINGLE_PROPOSAL_PAGE_URL,
      query: {
        dao: daoId,
        proposal: id,
      },
    });
  }, [daoId, id, router]);

  // const updateDate = parseISO(updatedAt);

  return (
    <div
      tabIndex={0}
      role="button"
      className={styles.content}
      onMouseDown={handleCardClick}
    >
      <div className={styles.divider} />
      <div className={styles.title}>{daoId}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.status}>{status}</div>
    </div>
  );
};
