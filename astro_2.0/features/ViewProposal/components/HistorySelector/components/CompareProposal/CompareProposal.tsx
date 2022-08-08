import React from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { ProposalFeedItem } from 'types/proposal';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { ExternalLink } from 'components/ExternalLink';

import {
  getContentNode,
  getProposalVariantLabel,
} from 'astro_2.0/features/ViewProposal/helpers';
import { CompareProposalContext } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposalContext';

import { formatISODate } from 'utils/format';

import styles from './CompareProposal.module.scss';

interface Props {
  current: ProposalFeedItem;
  content?: string;
  view: 'prev' | 'current' | null;
}

export const CompareProposal = React.forwardRef<HTMLDivElement, Props>(
  ({ current, view, content }, ref) => {
    const {
      proposalVariant,
      kind: { type },
      updatedAt,
      proposer,
      description,
      link,
    } = current;
    const { t } = useTranslation();
    const contentNode = getContentNode(current);

    return (
      <div className={cn(styles.root)}>
        <CompareProposalContext.Provider value={{ view }}>
          <div className={styles.proposalCell}>
            <InfoBlockWidget
              valueFontSize="L"
              label=""
              value={
                <div className={styles.proposalType}>
                  {getProposalVariantLabel(proposalVariant, type, t)}
                </div>
              }
            />
          </div>
          <div className={styles.countdownCell}>
            {formatISODate(updatedAt, 'dd MMMM yyyy, hh:mm')}
          </div>

          {content ? (
            <div
              className={styles.card}
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className={styles.card} ref={ref}>
              <div className={styles.proposerCell}>
                <InfoBlockWidget
                  label={t(`proposalCard.proposalOwner`)}
                  value={proposer}
                />
              </div>

              <div className={styles.descriptionCell}>
                <FieldWrapper
                  label={t(`proposalCard.proposalDescription`)}
                  fullWidth
                >
                  <div
                    className={styles.proposalDescription}
                    /* eslint-disable-next-line react/no-danger */
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                </FieldWrapper>

                <div className={styles.proposalExternalLink}>
                  <ExternalLink to={link} />
                </div>
              </div>

              <div className={styles.contentCell}>{contentNode}</div>
            </div>
          )}
        </CompareProposalContext.Provider>
      </div>
    );
  }
);
