/* eslint-disable */
import React, { useContext } from 'react';
import {
  IWizardInitialData,
  NearFunction,
} from 'astro_2.0/features/pages/plugins/UsePluginPopup/types';

type TData = {
  tokenName?: string;
  amountToMint?: string;
  recipient?: string;
  nearFunction?: NearFunction;
};

type TWizardContext = {
  data?: TData;
  setData: (d: unknown) => void;
  onClose: () => void;
  initialData: IWizardInitialData;
};

type TNearFunctionDetails = {
  contract: string;
  method: string;
};

export const WizardContext = React.createContext<TWizardContext>({
  // DAO_TEMPLATES: undefined,
  setData: () => null,
  onClose: () => null,
  initialData: {
    functions: [],
  },
});

export const useWizardContext = () => useContext<TWizardContext>(WizardContext);

export function getNearFunctionDetails(
  data: NearFunction | undefined
): TNearFunctionDetails {
  const defaultResponse = { contract: '', method: '' };

  if (!data) return defaultResponse;

  try {
    const obj = JSON.parse(data.code);

    return { contract: obj.contract, method: obj.method };
  } catch (e) {
    return defaultResponse;
  }
}
