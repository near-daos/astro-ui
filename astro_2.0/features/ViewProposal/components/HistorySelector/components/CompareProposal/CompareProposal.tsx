import React from 'react';
import cn from 'classnames';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';

import { ProposalFeedItem } from 'types/proposal';

import { InfoBlockWidget } from 'astro_2.0/components/InfoBlockWidget';
import { FieldWrapper } from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { ExternalLink } from 'components/ExternalLink';

import {
  getContentNode,
  getProposalVariantLabel,
} from 'astro_2.0/features/ViewProposal/helpers';
import { Tokens } from 'context/CustomTokensContext';
import { CustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';
import { CompareProposalContext } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposalContext';

import styles from './CompareProposal.module.scss';

interface Props {
  current: ProposalFeedItem;
  content?: string;
  tokens: Tokens;
  view: 'prev' | 'current' | null;
}

export const CompareProposal = React.forwardRef<HTMLDivElement, Props>(
  ({ current, tokens, view, content }, ref) => {
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
            {format(parseISO(updatedAt as string), 'dd MMMM yyyy, hh:mm')}
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

              <div className={styles.contentCell}>
                <CustomTokensContext.Provider value={{ tokens }}>
                  {contentNode}
                </CustomTokensContext.Provider>
              </div>
            </div>
          )}
        </CompareProposalContext.Provider>
      </div>
    );
  }
);
