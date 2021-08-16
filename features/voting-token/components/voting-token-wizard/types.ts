import { FC } from 'react';

export interface WizardStepProps {
  active?: boolean;
}

export type WizardStep = {
  id: number;
  component: FC<WizardStepProps>;
};

export type WizardFlow =
  | 'CREATE_NEW_TOKEN_STEPS'
  | 'ADOPT_NEAR_TOKEN_STEP'
  | 'ADOPT_TOKEN_FARM_STEPS';
