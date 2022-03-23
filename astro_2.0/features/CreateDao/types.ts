export type InfoStep = {
  displayName: string;
  address: string;
  purpose: string;
  isValid: boolean;
};

export type LegalStep = {
  legalStatus: string;
  legalLink: string;
  isValid: boolean;
};

export type ProposalsStep = {
  structure: string;
  proposals: string;
  isValid: boolean;
};

export type SubmitStep = {
  gas: number | string;
  isValid: boolean;
};

export type LinksStep = {
  websites: string[];
  isValid: boolean;
};

export type MembersStep = {
  accounts: string[];
  isValid: boolean;
};

export type AssetsStep = {
  flagCover: string;
  flagLogo: string;
  defaultFlag: string;
  isValid: boolean;
};

declare module 'little-state-machine' {
  interface GlobalState
    extends Record<
      string,
      | InfoStep
      | LegalStep
      | LinksStep
      | MembersStep
      | AssetsStep
      | ProposalsStep
      | SubmitStep
    > {
    info: InfoStep;
    kyc: LegalStep;
    links: LinksStep;
    members: MembersStep;
    assets: AssetsStep;
    submit: SubmitStep;
    proposals: ProposalsStep;
  }
}
