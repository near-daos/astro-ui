import get from 'lodash/get';
import Link from 'next/link';
import React, { VFC } from 'react';
import { useTranslation } from 'next-i18next';

import { SINGLE_PROPOSAL_PAGE_URL } from 'constants/routing';

import { ProposalFeedItem, FunctionCallProposalType } from 'types/proposal';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';

import { fromBase64ToObj } from 'utils/fromBase64ToObj';

import styles from './ViewVoteInOtherDao.module.scss';

interface ViewVoteInOtherDaoProps {
  proposal: ProposalFeedItem;
}

export const ViewVoteInOtherDao: VFC<ViewVoteInOtherDaoProps> = ({
  proposal,
}) => {
  const { t } = useTranslation();

  const { kind } = proposal;
  const { actions, receiverId } = kind as FunctionCallProposalType;

  if (!actions || actions.length === 0) {
    return null;
  }

  const { id, action } = fromBase64ToObj(get(actions, '0.args')) || {};

  const getLabel = (field: string) =>
    t(`proposalCard.voteInDao.${field}.label`);

  return (
    <div className={styles.root}>
      <FieldWrapper label={getLabel('targetDao')}>
        <FieldValue value={receiverId} />
      </FieldWrapper>

      <div className={styles.row}>
        <FieldWrapper label={getLabel('proposal')}>
          <FieldValue
            value={
              <Link
                href={{
                  pathname: SINGLE_PROPOSAL_PAGE_URL,
                  query: {
                    dao: receiverId,
                    proposal: `${receiverId}-${id}`,
                  },
                }}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.proposalLink}
                >
                  ID: {id}
                </a>
              </Link>
            }
          />
        </FieldWrapper>

        <FieldWrapper label={getLabel('vote')} className={styles.second}>
          <FieldValue value={action} />
        </FieldWrapper>
      </div>
    </div>
  );
};
