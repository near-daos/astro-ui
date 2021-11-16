import React, { FC } from 'react';

import {
  FieldValue,
  FieldWrapper
} from 'components/cards/proposal-card/components/field-wrapper';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { useCustomTokensContext } from 'context/CustomTokensContext';
import { Icon } from 'components/Icon';

import styles from './new-bounty-proposal-content.module.scss';

interface NewBountyProposalContentProps {
  description: string;
  link: string;
  amount: string;
  token: string;
  availableClaims: number;
  maxDeadline: string;
}

export const NewBountyProposalContent: FC<NewBountyProposalContentProps> = ({
  description,
  link,
  amount,
  token,
  availableClaims,
  maxDeadline
}) => {
  const { tokens } = useCustomTokensContext();
  const tokenData = token ? tokens[token] : tokens.NEAR;

  return (
    <div className={styles.root}>
      <div className={styles.description}>
        <FieldWrapper label="Description">
          <div>{description}</div>
        </FieldWrapper>
      </div>
      {link && (
        <div className={styles.link}>
          <ExternalLink to={link} />
        </div>
      )}
      <div className={styles.amount}>
        <FieldWrapper label="Amount">
          <FieldValue value={amount} />
        </FieldWrapper>
        {tokenData && (
          <FieldWrapper label="">
            <div className={styles.row}>
              <div className={styles.iconWrapper}>
                {tokenData.symbol === 'NEAR' ? (
                  <Icon name="tokenNear" />
                ) : (
                  <div
                    style={{
                      background: 'black',
                      backgroundImage: `url(${tokenData.icon})`
                    }}
                    className={styles.icon}
                  />
                )}
              </div>
              <div className={styles.symbol}>{tokenData.symbol}</div>
            </div>
          </FieldWrapper>
        )}
      </div>
      <div className={styles.claims}>
        <FieldWrapper label="Available claims">
          <FieldValue value={availableClaims} />
        </FieldWrapper>
      </div>
      <div className={styles.deadline}>
        <FieldWrapper label="Days to complete">
          <FieldValue value={maxDeadline} />
        </FieldWrapper>
      </div>
    </div>
  );
};
