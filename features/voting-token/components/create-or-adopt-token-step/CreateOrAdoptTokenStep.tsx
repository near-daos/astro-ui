import React, { FC } from 'react';
import cn from 'classnames';

import { WizardStepProps } from 'features/voting-token/components/voting-token-wizard/types';
import { WizardFlowButton } from 'features/voting-token/components/wizard-flow-button';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import { useWizardContext } from 'features/voting-token/components/voting-token-wizard/helpers';

import styles from './create-or-adopt-token-step.module.scss';

export const CreateOrAdoptTokenStep: FC<WizardStepProps> = () => {
  const {
    handleCancel,
    handleNext,
    handleSetSteps,
    activeFlow,
  } = useWizardContext();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2>Create or adopt a voting token</h2>
      </header>
      <WizardFlowButton
        active={activeFlow === 'CREATE_NEW_TOKEN_STEPS'}
        onClick={() => handleSetSteps('CREATE_NEW_TOKEN_STEPS')}
        icon={<div className={cn(styles.circle, styles.green)} />}
        title="Create a new token"
        description="A new token will be created for voting."
      />
      <WizardFlowButton
        active={activeFlow === 'ADOPT_TOKEN_FARM_STEPS'}
        onClick={() => handleSetSteps('ADOPT_TOKEN_FARM_STEPS')}
        icon={<div className={cn(styles.circle, styles.purple)} />}
        title="Adopt a Token Farm token"
        description="Anyone who owns this token can stake it and use it for DAO votes."
      />
      <WizardFlowButton
        active={activeFlow === 'ADOPT_NEAR_TOKEN_STEP'}
        onClick={() => handleSetSteps('ADOPT_NEAR_TOKEN_STEP')}
        icon={<Icon name="iconNear" width={56} />}
        title="Adopt the NEAR native token"
        description="Use the native NEAR token as a voting token. This allows voting by anyone who owns NEAR."
      />
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={handleCancel}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        &nbsp;&nbsp;
        <Button
          variant="primary"
          onClick={() => handleNext()}
          size="small"
          className={styles.ml8}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
