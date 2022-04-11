import { SelectorRow } from 'astro_2.0/features/pages/nestedDaoPagesContent/DaoPolicyPageContent/helpers';

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
  data: SelectorRow[] | null;
  isValid: boolean;
};

export type VotingStep = {
  data: SelectorRow[] | null;
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
      | VotingStep
      | SubmitStep
    > {
    info: InfoStep;
    kyc: LegalStep;
    links: LinksStep;
    members: MembersStep;
    assets: AssetsStep;
    submit: SubmitStep;
    proposals: ProposalsStep;
    voting: VotingStep;
  }
}
