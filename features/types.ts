import { Token as TokenDetails } from 'components/cards/member-card/types';

export const NEAR_TOKEN = 'NEAR';
export const FUNGIBLE_TOKEN = 'Fungible Token';

export type Token = typeof NEAR_TOKEN | typeof FUNGIBLE_TOKEN;

export type Vote = 'Yes' | 'No' | 'Dismiss';

export type VoteDetail = {
  limit: string;
  label: string;
  data?: VoteValue[];
};

export type VoteValue = {
  vote: Vote | null;
  percent: number;
};

export type VoteStat = {
  vote: Vote | null;
  value: number;
  percent: number;
};

export type VoterDetail = {
  id: string;
  name: string;
  vote: Vote | null;
  groups?: string[];
  timestamp?: string | null;
  transactionHash?: string | undefined;
  tokens?: TokenDetails;
};

export type GroupPolicyDetails = {
  value: string | number;
  suffix: string;
  tooltip: string;
};

export type BondDetail = {
  value: number;
  token: Token;
};
