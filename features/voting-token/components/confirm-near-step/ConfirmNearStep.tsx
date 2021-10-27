import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { useWizardContext } from 'features/voting-token/components/voting-token-wizard/helpers';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { VoteDetails } from 'components/vote-details';

import styles from './confirm-near-step.module.scss';

export const ConfirmNearStep: FC = () => {
  const { handleBack, handleSubmit } = useWizardContext();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Adopt NEAR for voting?</h2>
      </header>
      <div className={styles.description}>
        Anyone who owns <strong>NEAR</strong> can stake their tokens and use it
        to vote in meowzers.
      </div>
      <div className={styles.warning}>
        <span>
          <Icon name="buttonAlert" className={styles.infoicon} />
        </span>
        <span>
          Once <strong>NEAR</strong> is adopted as the voting token,{' '}
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
          onClick={() =>
            handleSubmit({
              tokenIcon: 'iconNear',
              tokenName: 'NEAR',
              tokenSymbol: 'near.tkn',
            })
          }
        >
          Propose
        </Button>
      </div>
    </div>
  );
};
