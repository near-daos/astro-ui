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
  vote: Vote;
  percent: number;
};

export type VoterDetail = {
  name: string;
  vote: Vote;
};

export type BondDetail = {
  value: number;
  token: Token;
};
