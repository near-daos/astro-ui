import React, { FC } from 'react';

import { useWizardContext } from 'features/voting-token/components/voting-token-wizard/helpers';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { VoteDetails } from 'components/VoteDetails';

import styles from './confirm-token-farm-token-step.module.scss';

export const ConfirmTokenFarmTokenStep: FC = () => {
  const { handleBack, handleSubmit, data } = useWizardContext();

  if (!data) return null;

  const { tokenName, tokenSymbol } = data;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Adopt {tokenName} for voting?</h2>
      </header>
      <div className={styles.avatar}>
        <div className={styles.selected} />
      </div>
      <div className={styles.name}>{tokenName}</div>
      <div className={styles.symbol}>{tokenSymbol}</div>
      <div className={styles.description}>
        Anyone who owns {tokenName} can stake their tokens and use it to vote in
        meowzers.
      </div>
      <div className={styles.warning}>
        <span>
          <Icon name="buttonAlert" className={styles.infoicon} />
        </span>
        <span>
          Once {tokenName} is adopted as the voting token,{' '}
          <strong>meowzers</strong> cannot change to a different voting token.
        </span>
      </div>
      <div className={styles.vote}>
        <ExpandableDetails label="Vote details">
          <VoteDetails scope="setVoteToken" />
        </ExpandableDetails>
      </div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={handleBack}
          size="small"
          className={styles.mr8}
        >
          Back
        </Button>
        &nbsp;&nbsp;
        <Button
          variant="primary"
          size="small"
          className={styles.ml8}
          onClick={() => handleSubmit()}
        >
          Propose
        </Button>
      </div>
    </div>
  );
};
