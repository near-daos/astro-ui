import dynamic from 'next/dynamic';
import React, { FC, useCallback, useState } from 'react';

import { Tabs } from 'components/Tabs';
import {
  IWizardInitialData,
  IWizardResult,
} from 'astro_2.0/features/pages/plugins/UsePluginPopup/types';

import { WizardContext } from './helpers';
import { CreateTokenView } from './components/CreateTokenView';
import { PreviousFunctionsView } from './components/PeviousFunctionsView';

import styles from './UsePluginWizard.module.scss';

const NewFunctionView = dynamic<unknown>(
  import('./components/NewFunctionView').then(mod => mod.NewFunctionView),
  {
    ssr: false,
  }
);

const TABS = [
  {
    id: 1,
    label: 'Previous functions',
    content: <PreviousFunctionsView />,
  },
  {
    id: 2,
    label: 'New function',
    content: <NewFunctionView />,
  },
];

interface UsePluginWizardProps {
  initialData: IWizardInitialData;
  onClose: () => void;
  onSubmit: (d: IWizardResult) => void;
}

export const UsePluginWizard: FC<UsePluginWizardProps> = ({
  initialData,
  onClose,
  onSubmit,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [data, setWizardData] = useState({
    nearFunction: undefined,
    tokenName: '',
    amountToMint: '',
    recipient: '',
  });

  const setData = useCallback(
    d => {
      setWizardData({
        ...data,
        ...d,
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
        {activeStep === 1 && <Tabs tabs={TABS} isControlled={false} />}
        {activeStep === 2 && <CreateTokenView />}
      </WizardContext.Provider>
    </div>
  );
};
