import React, { FC, useCallback, useState } from 'react';

import Tabs from 'components/tabs/Tabs';
import {
  IWizardInitialData,
  IWizardResult
} from 'features/plugins/components/use-plugin-popup/types';
import PreviousFunctionsView from 'features/plugins/components/use-plugin-popup/components/use-plugin-wizard/components/pevious-functions-view/PreviousFunctionsView';
import NewFunctionView from 'features/plugins/components/use-plugin-popup/components/use-plugin-wizard/components/new-function-view/NewFunctionView';
import CreateTokenView from 'features/plugins/components/use-plugin-popup/components/use-plugin-wizard/components/create-token-view/CreateTokenView';

import { WizardContext } from './helpers';

import styles from './use-plugin-wizard.module.scss';

const TABS = [
  {
    id: 1,
    label: 'Previous functions',
    content: <PreviousFunctionsView />
  },
  {
    id: 2,
    label: 'New function',
    content: <NewFunctionView />
  }
];

interface UsePluginWizardProps {
  initialData: IWizardInitialData;
  onClose: () => void;
  onSubmit: (d: IWizardResult) => void;
}

const UsePluginWizard: FC<UsePluginWizardProps> = ({
  initialData,
  onClose,
  onSubmit
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [data, setWizardData] = useState({
    nearFunction: undefined,
    tokenName: '',
    amountToMint: '',
    recipient: ''
  });

  const setData = useCallback(
    d => {
      setWizardData({
        ...data,
        ...d
      });

      if (activeStep !== 2) {
        setActiveStep(activeStep + 1);
      } else {
        onSubmit(d);
      }
    },
    [activeStep, data, onSubmit]
  );

  return (
    <div className={styles.root}>
      <WizardContext.Provider value={{ data, setData, initialData, onClose }}>
        {activeStep === 1 && <Tabs tabs={TABS} />}
        {activeStep === 2 && <CreateTokenView />}
      </WizardContext.Provider>
    </div>
  );
};

export default UsePluginWizard;
