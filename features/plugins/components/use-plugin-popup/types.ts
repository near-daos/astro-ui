export type NearFunction = {
  id: string;
  functionName: string;
  code: string;
};

export interface IWizardInitialData {
  functions: NearFunction[];
}

export interface IWizardResult {
  nearFunction: NearFunction;
  tokenName: string;
  amountToMint: string;
  recipient: string;
}
