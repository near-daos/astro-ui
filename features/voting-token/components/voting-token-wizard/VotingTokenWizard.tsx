import React, { FC, useCallback, useState } from 'react';

import { CreateOrAdoptTokenStep } from 'features/voting-token/components/create-or-adopt-token-step';
import { CreateVotingTokenStep } from 'features/voting-token/components/create-voting-token-step';
import { ConfirmTokenStep } from 'features/voting-token/components/confirm-token-step';
import { ChooseTokenFarmTokenStep } from 'features/voting-token/components/choose-token-farm-token-step';
import { ConfirmTokenFarmTokenStep } from 'features/voting-token/components/confirm-token-farm-token-step';
import { ConfirmNearStep } from 'features/voting-token/components/confirm-near-step';

import { TData, WizardContext } from './helpers';
import { WizardFlow, WizardStep } from './types';

import styles from './voting-token-wizard.module.scss';

const CREATE_NEW_TOKEN_STEPS = [
  {
    id: 1,
    component: CreateOrAdoptTokenStep
  },
  {
    id: 2,
    component: CreateVotingTokenStep
  },
  {
    id: 3,
    component: ConfirmTokenStep
  }
];

const ADOPT_TOKEN_FARM_STEPS = [
  {
    id: 1,
    component: CreateOrAdoptTokenStep
  },
  {
    id: 2,
    component: ChooseTokenFarmTokenStep
  },
  {
    id: 3,
    component: ConfirmTokenFarmTokenStep
  }
];

const ADOPT_NEAR_TOKEN_STEP = [
  {
    id: 1,
    component: CreateOrAdoptTokenStep
  },
  {
    id: 2,
    component: ConfirmNearStep
  }
];

const WIZARD_STEPS: { [key: string]: WizardStep[] } = {
  CREATE_NEW_TOKEN_STEPS,
  ADOPT_NEAR_TOKEN_STEP,
  ADOPT_TOKEN_FARM_STEPS
};

interface VotingTokenWizardProps {
  onSubmit: () => void;
  onClose: () => void;
}

export const VotingTokenWizard: FC<VotingTokenWizardProps> = ({
  onClose,
  onSubmit
}) => {
  const [activeFlow, setActiveFlow] = useState(
    'CREATE_NEW_TOKEN_STEPS' as WizardFlow
  );
  const [activeStep, setActiveStep] = useState(1);
  const [data, setData] = useState({} as TData);

  const handleSetSteps = useCallback((selectedFlow: WizardFlow) => {
    setActiveFlow(selectedFlow);
  }, []);

  const handleNext = useCallback(
    d => {
      if (d) {
        setData({
          ...data,
          ...d
        });
      }

      setActiveStep(activeStep + 1);
    },
    [activeStep, data]
  );

  const handleSubmit = useCallback(
    d => {
      if (d) {
        setData({
          ...data,
          ...d
        });
      }

      onSubmit();
    },
    [data, onSubmit]
  );

  const handleBack = useCallback(() => {
    setActiveStep(activeStep - 1);
  }, [activeStep]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const steps = WIZARD_STEPS[activeFlow];

  return (
    <div className={styles.root}>
      <WizardContext.Provider
        value={{
          handleSetSteps,
          handleNext,
          handleBack,
          handleCancel,
          handleSubmit,
          activeFlow,
          data
        }}
      >
        {steps
          .filter(step => step.id === activeStep)
          .map(step => {
            const Component = step.component;

            return <Component key={step.id} />;
          })}
      </WizardContext.Provider>
    </div>
  );
};
